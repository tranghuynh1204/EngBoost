import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserexamdraftService } from './userexamdraft.service';
import { CreateUserexamdraftDto } from './dto/create-userexamdraft.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { User } from 'src/decorator/user.decorator';

@Controller('user-exam-drafts')
export class UserexamdraftController {
  constructor(private readonly userexamdraftService: UserexamdraftService) {}

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserexamdraftDto: CreateUserexamdraftDto, @User() user) {
    return this.userexamdraftService.create(createUserexamdraftDto, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/get')
  async findOne(
    @Body() body: { sections: string[]; selectedTime: number; exam: string },
    @User() user,
  ) {
    const { sections, selectedTime, exam } = body;
    return this.userexamdraftService.findOne(
      sections,
      selectedTime,
      exam,
      user.sub,
    );
  }
}
