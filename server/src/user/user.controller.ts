import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('statistics')
  async userStatistics(@Query('days') days: number) {
    return this.userService.statistics(days);
  }
}
