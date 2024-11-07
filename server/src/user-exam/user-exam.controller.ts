import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserExamService } from './user-exam.service';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { UserExam } from './entities/user-exam.entity';

@Controller('user-exams')
export class UserExamController {
  constructor(private readonly userExamService: UserExamService) {}

  @Post()
  async create(
    @Body() createUserExamDto: CreateUserExamDto,
  ): Promise<UserExam> {
    return this.userExamService.create(createUserExamDto, '1'); //sau này thêm jwt để biết ng dùng
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
