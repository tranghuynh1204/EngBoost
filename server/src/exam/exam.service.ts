import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExcelService } from 'src/excel/excel.service';
import { Exam } from './entities/exam.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SectionService } from 'src/section/section.service';
import { UserExamService } from 'src/user-exam/user-exam.service';
import { CommentService } from 'src/comment/comment.service';

interface Result {
  sections?: {
    name: string;
    tags: string[];
    correct: number;
    incorrect: number;
    skipped: number;
  }[];
  mapQuestion?: {
    [tag: string]: {
      correct: number;
      incorrect: number;
      skipped: number;
      questions: {
        content: string;
        options: string;
        correctAnswer: string;
        serial: string;
        tag: string;
        answer: string;
      }[];
    };
  };
}
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

  // findAll() {
  //   return `This action returns all exam`;
  // }

  async findOne(id: string): Promise<any> {
    const exam = await this.examModel
      .findById(id)
      .populate('sections')
      .populate('comments')
      .exec();
    if (!exam) {
      throw new NotFoundException(`Không tìm thấy bài thi với ${id}`);
    }
    exam.comments = await this.commentService.getReplies(exam.comments);
    return exam;
  }

  async addComment(examId: string, commentId: string) {
    return await this.examModel.findByIdAndUpdate(
      examId,
      { $push: { comments: commentId } },
      { new: true },
    );
  }

  async gradeExam(userExamId: string) {
    const userExam = await this.userExamService.findOne(userExamId);
    const sectionExams = userExam.sections;
    const answers = userExam.answers;
    const result: Result = { sections: [] };
    const tagObject = {};

    sectionExams.forEach((sectionExam) => {
      const sectionResult = this.createSectionResult(sectionExam);
      sectionExam.questions.forEach((question) => {
        const tagResult = this.getOrCreateTagResult(tagObject, question.tag);
        const questionResult = this.createQuestionResult(question, answers);

        this.updateResults(sectionResult, tagResult, questionResult);
        tagResult.questions.push(questionResult);
      });

      result.sections.push(sectionResult);
    });

    result.mapQuestion = tagObject;
    return result;
  }

  // Tạo một đối tượng chứa kết quả cho từng phần thi
  private createSectionResult(sectionExam: any) {
    return {
      name: sectionExam.name,
      tags: sectionExam.tags,
      correct: 0,
      incorrect: 0,
      skipped: 0,
    };
  }

  // Lấy hoặc tạo kết quả cho một tag
  private getOrCreateTagResult(tagObject: any, tag: string) {
    if (!tagObject[tag]) {
      tagObject[tag] = {
        correct: 0,
        incorrect: 0,
        skipped: 0,
        questions: [],
      };
    }
    return tagObject[tag];
  }

  // Tạo một đối tượng chứa kết quả của một câu hỏi
  private createQuestionResult(question: any, answers: Map<string, string>) {
    return {
      content: question.content,
      options: question.options,
      correctAnswer: question.correctAnswer,
      serial: question.serial,
      tag: question.tag,
      answer: answers.get(question.serial),
    };
  }

  // Cập nhật kết quả cho phần thi và tag dựa trên câu trả lời
  private updateResults(section: any, tag: any, question: any) {
    if (question.answer === '') {
      tag.skipped++;
      section.skipped++;
    } else if (question.answer !== question.correctAnswer) {
      tag.incorrect++;
      section.incorrect++;
    } else {
      tag.correct++;
      section.correct++;
    }
  }

  // update(id: number, updateExamDto: UpdateExamDto) {
  //   return `This action updates a #${id} exam`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} exam`;
  // }
}
