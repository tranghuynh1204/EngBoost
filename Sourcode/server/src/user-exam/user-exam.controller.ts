import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { UserExamService } from './user-exam.service';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { UserExam } from './entities/user-exam.entity';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('user-exams')
export class UserExamController {
  constructor(private readonly userExamService: UserExamService) {}

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(
    @Body() createUserExamDto: CreateUserExamDto,
    @User() user,
  ): Promise<UserExam> {
    return this.userExamService.create(createUserExamDto, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/exam/:examId/')
  async getUserAttemptsByExam(
    @Param('examId') examId: string,
    @User() user,
  ): Promise<UserExam[]> {
    return await this.userExamService.findAllByExamAndUser(examId, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/new')
  async getNew(@User() user) {
    return await this.userExamService.getNew(user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('/history')
  async searchExams(
    @User() user,
    @Query('currentPage') currentPage?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const effectivePage = currentPage || 1;
    const effectivePageSize = pageSize || 10;
    return this.userExamService.getHistory(
      effectivePage,
      effectivePageSize,
      user.sub,
    );
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/analytics')
  async analytics(@User() user, @Body('days') days: number) {
    return this.userExamService.analytics(user.sub, days);
  }

  @Get('statistics')
  async userExamStatistics(@Query('days') days: number) {
    return this.userExamService.statistics(days);
  }
}
