import { Injectable } from '@nestjs/common';
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
      for (const question of section.questions) {
        if (question.correctAnswer === answersMap.get(question.serial))
          correct++;
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

  async findOne(id: string): Promise<UserExam> {
    return await this.userExamModel.findById(id).populate('sections').exec();
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
}
