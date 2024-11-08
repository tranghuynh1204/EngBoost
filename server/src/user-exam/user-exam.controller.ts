import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserExamService } from './user-exam.service';
import { CreateUserExamDto } from './dto/create-user-exam.dto';

import { UserExam } from './entities/user-exam.entity';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
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
