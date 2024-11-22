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
    return this.userexamdraftService.create(createUserexamdraftDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userexamdraftService.findOne(+id);
  }
}
