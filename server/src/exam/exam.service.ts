import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExcelService } from 'src/excel/excel.service';
import { Exam } from './entities/exam.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SectionService } from 'src/section/section.service';
import { UserExamService } from 'src/user-exam/user-exam.service';
import { CommentService } from 'src/comment/comment.service';
import { UserExamResult } from 'src/shared/interfaces/user-exam-result.interface';
import { ExamDetailDto } from './dto/exam-detail.dto';

@Injectable()
export class ExamService {
  constructor(
    private readonly excelService: ExcelService,
    private readonly sectionService: SectionService,
    private readonly userExamService: UserExamService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
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

  async findExamDetail(id: string): Promise<ExamDetailDto> {
    const exam = await this.examModel
      .findById(id)
      .populate('sections')
      .populate('comments')
      .lean({ virtuals: true })
      .exec();
    if (!exam) {
      throw new NotFoundException(`Không tìm thấy bài thi với ${id}`);
    }
    const { comments, commentCount } =
      await this.commentService.getCommentToExamAndCount(exam.comments, id);
    const userCount = await this.userExamService.getUniqueUserCountForExam(id);
    exam.comments = comments;
    exam.commentCount = commentCount;
    exam.userCount = userCount;
    return ExamDetailDto.mapExamToDto(exam);
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
}
