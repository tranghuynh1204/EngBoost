import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { InjectModel } from '@nestjs/mongoose';
import { UserExam, UserExamDocument } from './entities/user-exam.entity';
import { Model, Types } from 'mongoose';
import { SectionService } from 'src/section/section.service';

@Injectable()
export class UserExamService {
  constructor(
    private readonly sectionService: SectionService,
    @InjectModel(UserExam.name) private userExamModel: Model<UserExamDocument>,
  ) {}

  async create(createUserExamDto: CreateUserExamDto, userId: string) {
    const sections = await this.sectionService.findByIds(
      createUserExamDto.sections,
    );
    const answersMap: Map<string, string> = new Map(
      Object.entries(createUserExamDto.answers),
    );
    let correct = 0;
    for (const section of sections) {
      for (const group of section.groups) {
        for (const question of group.questions) {
          if (question.correctAnswer === answersMap.get(question.serial))
            correct++;
        }
      }
    }
    const newUserExam = new this.userExamModel({
      ...createUserExamDto,
      exam: new Types.ObjectId(createUserExamDto.exam),
      user: userId,
      result: correct + '/' + answersMap.size,
    });
    return newUserExam.save();
  }

  async findOne(id: string, userId: string): Promise<UserExam> {
    return await this.userExamModel
      .findOne({ _id: new Types.ObjectId(id), user: userId })
      .populate('sections')
      .populate('exam', 'title')
      .exec();
  }

  async getUniqueUserCountForExam(examId: string): Promise<number> {
    const uniqueUsers = await this.userExamModel
      .distinct('user', { exam: new Types.ObjectId(examId) })
      .exec();
    return uniqueUsers.length;
  }

  async findAllByExamAndUser(
    examId: string,
    userId: string,
  ): Promise<UserExam[]> {
    return await this.userExamModel
      .find({ exam: new Types.ObjectId(examId), user: userId })
      .select('startTime duration result')
      .exec();
  }

  async getNew(userId: string) {
    const results = await this.userExamModel
      .find({ user: userId })
      .select('startTime duration result sections') // Lấy thêm sections từ userExam
      .populate({
        path: 'exam',
        select: 'title sections id', // Lấy title và sections từ exam
        populate: {
          path: 'sections', // Populate sections của exam
        },
      })
      .populate({
        path: 'sections', // Populate sections của userExam
        select: 'name', // Chỉ lấy trường name
      })
      .sort({ startTime: -1 }) // Sắp xếp theo startTime giảm dần
      .limit(4)
      .lean()
      .exec();

    return results.map((userExam) => ({
      startTime: userExam.startTime,
      duration: userExam.duration,
      result: userExam.result,
      _id: userExam._id,
      sections:
        userExam.exam.sections?.length === userExam.sections?.length
          ? 'full test'
          : userExam.sections,
      exam: (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sections, ...rest } = userExam.exam; // Loại bỏ sections khỏi exam
        return rest; // Trả về exam mà không có sections
      })(),
    }));
  }

  async getHistory(currentPage: number, pageSize: number, userId: string) {
    const totalUserExams = await this.userExamModel
      .countDocuments({ user: userId })
      .exec();

    const totalPages = Math.ceil(totalUserExams / pageSize);

    if (currentPage > totalPages) {
      throw new NotFoundException('Trang hiện tại vượt quá tổng số trang');
    }
    const results = await this.userExamModel
      .find({ user: userId })
      .select('startTime duration result sections') // Lấy thêm sections từ userExam
      .populate({
        path: 'exam',
        select: 'title sections id', // Lấy title và sections từ exam
        populate: {
          path: 'sections', // Populate sections của exam
        },
      })
      .populate({
        path: 'sections', // Populate sections của userExam
        select: 'name', // Chỉ lấy trường name
      })
      .sort({ startTime: -1 }) // Sắp xếp theo startTime giảm dần
      .skip((currentPage - 1) * pageSize) // Phân trang
      .limit(pageSize)
      .lean()
      .exec();

    const data = results.map((userExam) => ({
      startTime: userExam.startTime,
      duration: userExam.duration,
      result: userExam.result,
      _id: userExam._id,
      sections:
        userExam.exam.sections?.length === userExam.sections?.length
          ? 'full test'
          : userExam.sections,
      exam: (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { sections, ...rest } = userExam.exam; // Loại bỏ sections khỏi exam
        return rest; // Trả về exam mà không có sections
      })(),
    }));
    return {
      data: data,
      totalPages,
      currentPage,
      pageSize,
    };
  }
}
