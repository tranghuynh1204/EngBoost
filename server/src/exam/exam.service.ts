import { Injectable, NotFoundException } from '@nestjs/common';
import { ExcelService } from 'src/excel/excel.service';
import { Exam } from './entities/exam.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SectionService } from 'src/section/section.service';
import { UserExamService } from 'src/user-exam/user-exam.service';
import { UserExamResult } from 'src/shared/interfaces/user-exam-result.interface';
import { GroupDocument } from 'src/section/entities/group.entity';

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

  async findOne(id: string): Promise<Exam> {
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
          pipeline: [
            {
              $project: {
                name: 1,
                questionCount: 1,
                tags: 1,
              },
            },
          ],
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
          comments: 0,
          userExams: 0,
        },
      },
    ]);
    if (!exam) {
      throw new NotFoundException(`Không tìm thấy bài thi`);
    }

    return exam;
  }

  async addComment(examId: string, commentId: string) {
    return await this.examModel.findByIdAndUpdate(
      examId,
      { $push: { comments: commentId } },
      { new: true },
    );
  }

  async gradeExam(userExamId: string, userId: string) {
    const userExam = await this.userExamService.findOne(userExamId, userId);
    if (!userExam) {
      throw new NotFoundException(`Không tìm thấy bài thi`);
    }

    const answers = userExam.answers;
    const mapQuestion = {};

    const mapGroup = {};

    const result: UserExamResult = {
      exam: userExam.exam,
      sections: [],
      correct: 0,
      incorrect: 0,
      skipped: 0,
      duration: userExam.duration,
      result: userExam.result,
      mapQuestion,
      mapGroup,
    };

    //Duyệt các phần mà người dùng thi
    for (const sectionExam of userExam.sections) {
      //tạo map để gom nhóm các câu hỏi

      const mapTagQuestion = {};
      for (const tag of sectionExam.tags) {
        mapTagQuestion[tag] = {
          correct: 0,
          incorrect: 0,
          skipped: 0,
          questions: [],
        };
      }
      //tạo kết quả của phần thi hiện tại
      const currentSection = {
        name: sectionExam.name,
        mapTagQuestion: mapTagQuestion,
        correct: 0,
        incorrect: 0,
        skipped: 0,
      };
      //duyệt các câu hỏi trong phần thi hiện tại
      for (const group of sectionExam.groups) {
        const groupDocument = group as GroupDocument;

        // Thêm dữ liệu vào Map
        mapGroup[groupDocument._id.toString()] = {
          documentText: group.documentText,
          audio: group.audio,
          image: group.image,
        };

        //tạo câu hỏi kết quả
        for (const question of group.questions) {
          const questionResult = {
            content: question.content,
            options: question.options,
            correctAnswer: question.correctAnswer,
            tags: question.tags,
            answer: answers.get(question.serial.toString()),
            group: (group as GroupDocument)._id,
            answerExplanation: question.answerExplanation,
          };

          if (!questionResult.answer) {
            result.skipped++;
            currentSection.skipped++;
          } else if (questionResult.answer !== questionResult.correctAnswer) {
            result.incorrect++;
            currentSection.incorrect++;
          } else {
            result.correct++;
            currentSection.correct++;
          }
          mapQuestion[question.serial] = questionResult;
          for (const tag of question.tags) {
            const TagQuestion = mapTagQuestion[tag];
            if (!questionResult.answer) {
              TagQuestion.skipped++;
            } else if (questionResult.answer !== questionResult.correctAnswer) {
              TagQuestion.incorrect++;
            } else {
              TagQuestion.correct++;
            }
            TagQuestion.questions.push(question.serial);
          }
        }
      }
      result.sections.push(currentSection);
    }

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

  async findSolutions(id: string): Promise<Exam> {
    const [exam] = await this.examModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } }, // Lọc theo exam ID
      {
        $lookup: {
          from: 'sections',
          localField: 'sections',
          foreignField: '_id',
          as: 'sections',
        },
      },

      {
        $project: {
          title: 1,
          sections: {
            name: 1,
            groups: {
              image: 1,
              transcript: 1,
              questions: {
                serial: 1,
                correctAnswer: 1,
              },
            },
          },
        },
      },
    ]);
    if (!exam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }

    return exam;
  }

  // Lấy solution cho một section cụ thể trong một exam
  async findSolution(id: string, sectionId: string): Promise<Exam> {
    const [exam] = await this.examModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } }, // Lọc theo exam ID
      {
        $lookup: {
          from: 'sections',
          localField: 'sections',
          foreignField: '_id',
          as: 'sections',
        },
      },
      {
        $unwind: '$sections', // Làm phẳng mảng sections
      },
      {
        $match: {
          'sections._id': new Types.ObjectId(sectionId), // Lọc phần thi theo sectionId
        },
      },
      {
        $project: {
          title: 1,
          sections: {
            name: 1,
            groups: {
              image: 1,
              transcript: 1,
              questions: {
                serial: 1,
                correctAnswer: 1,
              },
            },
          },
        },
      },
    ]);
    if (!exam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }

    return exam;
  }
}
