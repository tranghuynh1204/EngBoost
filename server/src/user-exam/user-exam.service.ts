import { Injectable } from '@nestjs/common';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { InjectModel } from '@nestjs/mongoose';
import { UserExam, UserExamDocument } from './entities/user-exam.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserExamService {
  constructor(
    @InjectModel(UserExam.name) private userExamModel: Model<UserExamDocument>,
  ) {}

  async create(createUserExamDto: CreateUserExamDto, userId: string) {
    const newUserExam = new this.userExamModel({
      ...createUserExamDto,
      exam: new Types.ObjectId(createUserExamDto.exam),
      user: userId,
    });
    return newUserExam.save();
  }

  // findAll() {
  //   return `This action returns all userExam`;
  // }

  async findOne(id: string): Promise<UserExam> {
    return await this.userExamModel.findById(id).populate('sections').exec();
  }

  async getUniqueUserCountForExam(examId: string): Promise<number> {
    const uniqueUsers = await this.userExamModel
      .distinct('user', { exam: examId })
      .exec();
    return uniqueUsers.length; // Trả về số lượng người duy nhất đã làm bài thi
  }

  // update(id: number, updateUserExamDto: UpdateUserExamDto) {
  //   return `This action updates a #${id} userExam`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userExam`;
  // }
}
