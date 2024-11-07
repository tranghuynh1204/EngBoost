import { Injectable } from '@nestjs/common';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { InjectModel } from '@nestjs/mongoose';
import { UserExam, UserExamDocument } from './entities/user-exam.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserExamService {
  constructor(
    @InjectModel(UserExam.name) private userExamModel: Model<UserExamDocument>,
  ) {}

  async create(createUserExamDto: CreateUserExamDto, userId: string) {
    const newUserExam = new this.userExamModel({
      ...createUserExamDto,
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

  // update(id: number, updateUserExamDto: UpdateUserExamDto) {
  //   return `This action updates a #${id} userExam`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userExam`;
  // }
}
