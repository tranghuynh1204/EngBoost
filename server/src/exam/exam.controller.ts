import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExamService } from './exam.service';
import { Exam } from './entities/exam.entity';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file): Promise<Exam> {
    return this.examService.create(file);
  }

  @Get(':id')
  async getExam(@Param('id') id: string): Promise<any> {
    return this.examService.findOne(id);
  }

  @Post(':examId/result/:userExamId')
  async gradeExam(@Param('userExamId') userExamId: string): Promise<any> {
    return this.examService.gradeExam(userExamId);
  }
}
