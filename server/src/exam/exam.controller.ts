import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExamService } from './exam.service';
import { Exam } from './entities/exam.entity';
import { UserExamResult } from 'src/shared/interfaces/user-exam-result.interface';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file): Promise<Exam> {
    return this.examService.create(file);
  }

  @Post(':examId/result/:userExamId')
  async gradeExam(@Param('userExamId') userExamId: string) {
    return this.examService.gradeExam(userExamId);
  }

  @Get('search')
  async searchExams(
    @Query('category') category: string, // Lọc theo category
    @Query('title') title: string, // Lọc theo title
    @Query('currentPage') currentPage?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const effectivePage = currentPage || 1;
    const effectivePageSize = pageSize || 10;
    return this.examService.searchExams(
      category,
      title,
      effectivePage,
      effectivePageSize,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examService.findOne(id);
  }
}
