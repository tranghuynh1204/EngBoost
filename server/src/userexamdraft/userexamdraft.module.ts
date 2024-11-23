import { Module } from '@nestjs/common';
import { UserexamdraftService } from './userexamdraft.service';
import { UserexamdraftController } from './userexamdraft.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserExamDraft,
  UserExamDraftSchema,
} from './entities/userexamdraft.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserExamDraft.name, schema: UserExamDraftSchema },
    ]),
  ],
  controllers: [UserexamdraftController],
  providers: [UserexamdraftService],
})
export class UserexamdraftModule {}
