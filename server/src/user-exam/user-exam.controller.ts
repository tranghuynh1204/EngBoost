import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserExamService } from './user-exam.service';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { UserExam } from './entities/user-exam.entity';
import { User } from 'src/auth/decorator/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user-exams')
export class UserExamController {
  constructor(private readonly userExamService: UserExamService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createUserExamDto: CreateUserExamDto,
    @User() user,
  ): Promise<UserExam> {
    return this.userExamService.create(createUserExamDto, user.sub); //sau này thêm jwt để biết ng dùng
  }

  // @Get()
  // findAll() {
  //   return this.userExamService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userExamService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserExamDto: UpdateUserExamDto) {
  //   return this.userExamService.update(+id, updateUserExamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userExamService.remove(+id);
  // }
}
