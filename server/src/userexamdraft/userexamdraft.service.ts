import { Injectable } from '@nestjs/common';
import { CreateUserexamdraftDto } from './dto/create-userexamdraft.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserExamDraft,
  UserExamDraftDocument,
} from './entities/userexamdraft.entity';

@Injectable()
export class UserexamdraftService {
  constructor(
    @InjectModel(UserExamDraft.name)
    private userExamDraftDocument: Model<UserExamDraftDocument>,
  ) {}
  async create(createUserexamdraftDto: CreateUserexamdraftDto, userId: string) {
    const examId = new Types.ObjectId(createUserexamdraftDto.exam);
    const objectIds = createUserexamdraftDto.sections.map(
      (id) => new Types.ObjectId(id),
    );

    // Check if the user already has a draft for the exam
    const existingUserExam = await this.userExamDraftDocument.findOneAndUpdate(
      { user: userId }, // Find by user and exam
      {
        ...createUserexamdraftDto,
        sections: objectIds,
        exam: examId,
        user: userId,
      }, // Update with new data
      { new: true, upsert: true }, // Return the updated document, create if not found
    );

    return existingUserExam;
  }

  async findOne(
    sections: string[],
    selectedTime: number,
    exam: string,
    userId: string,
  ) {
    const objectIds = sections.map((id) => new Types.ObjectId(id));
    return await this.userExamDraftDocument.findOne({
      sections: { $all: objectIds },
      selectedTime,
      exam: new Types.ObjectId(exam),
      user: userId,
    });
  }
}
