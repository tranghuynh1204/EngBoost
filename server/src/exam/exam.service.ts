import { Injectable, NotFoundException } from '@nestjs/common';
import { ExcelService } from 'src/excel/excel.service';
import { Exam } from './entities/exam.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SectionService } from 'src/section/section.service';
import { UserExamService } from 'src/user-exam/user-exam.service';
import { UserExamResult } from 'src/shared/interfaces/user-exam-result.interface';

import { SectionDto } from 'src/section/entities/section.dto';

@Injectable()
export class ExamService {
  constructor(
    private readonly excelService: ExcelService,
    private readonly sectionService: SectionService,
    private readonly userExamService: UserExamService,
    @InjectModel(Exam.name) private examModel: Model<Exam>,
  ) {}

  async create(file: any): Promise<Exam> {
    const examData = await this.excelService.parseToExam(file);
    const session = await this.examModel.db.startSession();
    session.startTransaction();
    try {
      // Lưu các sections
      const sections = await Promise.all(
        examData.sections.map((section) =>
          this.sectionService.create(section).then(({ _id }) => _id),
        ),
      );
      examData.sections = sections;
      const exam = new this.examModel(examData);
      await exam.save();

      // Cam kết giao dịch
      await session.commitTransaction();
      return exam;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findExamDetail(id: string): Promise<Exam> {
    const [exam] = await this.examModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } }, // Match the exam by ID
      {
        $lookup: {
          from: 'comments', // Replace with your comments collection name
          localField: '_id',
          foreignField: 'exam', // Field in comments that references the exam
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'sections', // Replace with your comments collection name
          localField: 'sections',
          foreignField: '_id', // Field in comments that references the exam
          as: 'sections',
        },
      },
      {
        $lookup: {
          // Lookup to count unique users related to the exam
          from: 'userexams', // Replace with your user exams collection name
          localField: '_id',
          foreignField: 'exam', // Field in user exams that references the exam
          as: 'userExams',
        },
      },
      {
        $unwind: { path: '$userExams', preserveNullAndEmptyArrays: true }, // Unwind userExams to individual documents
      },
      {
        $group: {
          _id: '$_id', // Group by exam ID
          title: { $first: '$title' }, // Giữ lại các trường bạn muốn
          category: { $first: '$category' },
          duration: { $first: '$duration' },
          sections: { $first: '$sections' },
          sectionCount: { $first: '$sectionCount' },
          questionCount: { $first: '$questionCount' },
          comments: { $first: '$comments' },
          userExams: { $addToSet: '$userExams.user' }, // Collect unique users into a set
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' }, // Count of comments
          userCount: { $size: { $ifNull: ['$userExams', []] } }, // Count of users
        },
      },
      {
        $project: {
          comments: 0, // Optionally, remove the comments array
          userExams: 0, // Optionally, remove the userExams array
        },
      },
    ]);
    if (!exam) {
      throw new NotFoundException(`Không tìm thấy bài thi`);
    }
    exam.sections = SectionDto.mapSectionsToDtos(exam.sections);

    return exam;
  }

  async addComment(examId: string, commentId: string) {
    return await this.examModel.findByIdAndUpdate(
      examId,
      { $push: { comments: commentId } },
      { new: true },
    );
  }

  async gradeExam(userExamId: string): Promise<UserExamResult> {
    // Truy vấn bài thi của người dùng
    const userExam = await this.userExamService.findOne(userExamId);
    if (!userExam) {
      throw new NotFoundException(
        `Không tìm thấy bài thi với ID: ${userExamId}`,
      );
    }

    const answers = userExam.answers;
    const mapQuestion = {};
    const result: UserExamResult = {
      sections: [],
      correct: 0,
      incorrect: 0,
      skipped: 0,
    };

    // Duyệt qua các phần thi và câu hỏi
    for (const sectionExam of userExam.sections) {
      // Khởi tạo kết quả phần thi
      const sectionResult = {
        name: sectionExam.name,
        tags: sectionExam.tags,
        correct: 0,
        incorrect: 0,
        skipped: 0,
      };

      for (const question of sectionExam.questions) {
        // Lấy hoặc tạo mới kết quả tag nếu chưa có
        if (!mapQuestion[question.tag]) {
          mapQuestion[question.tag] = {
            correct: 0,
            incorrect: 0,
            skipped: 0,
            questions: [],
          };
        }
        const tagResult = mapQuestion[question.tag];

        // Tạo đối tượng chứa kết quả câu hỏi
        const questionResult = {
          content: question.content,
          options: question.options,
          correctAnswer: question.correctAnswer,
          serial: question.serial,
          tag: question.tag,
          answer: answers.get(question.serial),
        };

        // Xác định và cập nhật loại kết quả (correct, incorrect, skipped)
        if (!questionResult.answer) {
          result.skipped++;
          tagResult.skipped++;
          sectionResult.skipped++;
        } else if (questionResult.answer !== questionResult.correctAnswer) {
          result.incorrect++;
          tagResult.incorrect++;
          sectionResult.incorrect++;
        } else {
          result.correct++;
          tagResult.correct++;
          sectionResult.correct++;
        }

        // Thêm câu hỏi vào kết quả tag
        tagResult.questions.push(questionResult);
      }

      // Thêm kết quả phần thi vào mảng kết quả
      result.sections.push(sectionResult);
    }

    result.mapQuestion = mapQuestion; // Thêm bản đồ các tag vào kết quả
    return result;
  }

  async searchExams(
    category: string,
    title: string,
    currentPage: number,
    pageSize: number,
  ) {
    const query: any = {};
    if (category) {
      query.category = category;
    }
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }
    const totalItems = await this.examModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage > totalPages) {
      throw new NotFoundException('Trang hiện tại vượt quá tổng số trang');
    }
    const exams = await this.examModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'comments', // Replace with your comments collection name
          localField: '_id',
          foreignField: 'exam', // Field in comments that references the exam
          as: 'comments',
        },
      },
      {
        $lookup: {
          // Lookup to count unique users related to the exam
          from: 'userexams', // Replace with your user exams collection name
          localField: '_id',
          foreignField: 'exam', // Field in user exams that references the exam
          as: 'userExams',
        },
      },
      {
        $unwind: { path: '$userExams', preserveNullAndEmptyArrays: true }, // Unwind userExams to individual documents
      },
      {
        $group: {
          _id: '$_id', // Group by exam ID
          title: { $first: '$title' }, // Giữ lại các trường bạn muốn
          category: { $first: '$category' },
          duration: { $first: '$duration' },
          sectionCount: { $first: '$sectionCount' },
          questionCount: { $first: '$questionCount' },
          comments: { $first: '$comments' }, // Keep the original comments array
          userExams: { $addToSet: '$userExams.user' }, // Collect unique users into a set
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' }, // Count of comments
          userCount: { $size: { $ifNull: ['$userExams', []] } }, // Count of users
        },
      },
      {
        $project: {
          comments: 0, // Optionally, remove the comments array
          userExams: 0,
        },
      },
      {
        $skip:
          Number.isInteger(currentPage - 1) && Number.isInteger(pageSize)
            ? (currentPage - 1) * pageSize
            : 0,
      },
      { $limit: pageSize > 0 && Number.isInteger(pageSize) ? pageSize : 10 },
    ]);

    return {
      data: exams,
      totalPages,
      currentPage,
      pageSize,
    };
  }
}
