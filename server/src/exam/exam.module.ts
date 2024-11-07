import { forwardRef, Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExcelService } from 'src/excel/excel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './entities/exam.entity';
import { SectionModule } from 'src/section/section.module';
import { UserExamModule } from 'src/user-exam/user-exam.module';

import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    SectionModule,
    UserExamModule,
    forwardRef(() => CommentModule),
  ],
  controllers: [ExamController],
  providers: [ExamService, ExcelService],
  exports: [ExamService],
})
export class ExamModule {}
