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
    private userExamInProcessModal: Model<UserExamDraftDocument>,
  ) {}
  create(createUserexamdraftDto: CreateUserexamdraftDto, userId: string) {
    const objectIds = createUserexamdraftDto.sections.map(
      (id) => new Types.ObjectId(id),
    );

    const newUserExam = new this.userExamInProcessModal({
      ...createUserexamdraftDto,
      sections: objectIds,
      exam: new Types.ObjectId(createUserexamdraftDto.exam),
      user: userId,
    });

    return newUserExam.save();
  }

  findOne(id: number) {
    return `This action returns a #${id} userexamdraft`;
  }
}
