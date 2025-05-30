import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExamService } from './exam.service';
import { Exam } from './entities/exam.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/decorator/user.decorator';
import { Response } from 'express';
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file): Promise<Exam> {
    return this.examService.create(file);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string, @UploadedFile() file): Promise<Exam> {
    return this.examService.update(id, file);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':examId/result/:userExamId')
  async gradeExam(@Param('userExamId') userExamId: string, @User() user) {
    return this.examService.gradeExam(userExamId, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':examId/result/:userExamId/details')
  async getAnswerDetail(@Param('userExamId') userExamId: string, @User() user) {
    return this.examService.getAnswerDetail(userExamId, user.sub);
  }

  @Get('search')
  async searchExams(
    @Query('category') category: string, // Lọc theo category
    @Query('title') title: string, // Lọc theo title
    @Query('currentPage') currentPage?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const effectivePage = currentPage || 1;
    const effectivePageSize = pageSize || 8;
    return this.examService.searchExams(
      category,
      title,
      effectivePage,
      effectivePageSize,
    );
  }

  @Get('new')
  async getNew() {
    return this.examService.getNew();
  }

  @UseGuards(AuthGuard)
  @Get(':id/solutions')
  async findSolutions(@Param('id') id: string): Promise<Exam> {
    return this.examService.findSolutions(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/parts/:sectionId/solutions')
  async findSolution(
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
  ): Promise<Exam> {
    return this.examService.findSolution(id, sectionId);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/practice')
  async getPractice(
    @Body('id') id: string,
    @Body('sectionIds') sectionIds: string[],
  ) {
    return this.examService.getPractice(id, sectionIds);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('statistics')
  async examStatistics() {
    return this.examService.statistics();
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('export/:id')
  async export(@Param('id') id: string, @Res() res: Response) {
    return this.examService.export(id, res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examService.findOne(id);
  }
}
