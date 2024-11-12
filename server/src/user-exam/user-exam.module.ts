import { Module } from '@nestjs/common';
import { UserExamService } from './user-exam.service';
import { UserExamController } from './user-exam.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserExam, UserExamSchema } from './entities/user-exam.entity';
import { SectionModule } from 'src/section/section.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserExam.name, schema: UserExamSchema },
    ]),
    SectionModule,
  ],

  controllers: [UserExamController],
  providers: [UserExamService],
  exports: [UserExamService],
})
export class UserExamModule {}
