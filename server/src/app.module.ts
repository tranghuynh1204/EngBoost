import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExamModule } from './exam/exam.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelService } from './excel/excel.service';
import { UserExamModule } from './user-exam/user-exam.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tlcn'),
    ExamModule,
    UserExamModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExcelService],
})
export class AppModule {}
