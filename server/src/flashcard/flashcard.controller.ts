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
import { FlashcardService } from './flashcard.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/decorator/user.decorator';
import { Flashcard } from './entities/flashcard.entity';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(
    @Body() createFlashcardDto: CreateFlashcardDto,
    @User() user,
  ): Promise<Flashcard> {
    return this.flashcardService.create(createFlashcardDto, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll(@User() user) {
    return this.flashcardService.findAll(user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this.flashcardService.findOne(id, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<Flashcard> {
    return this.flashcardService.update(id, updateFlashcardDto, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @User() user): Promise<Flashcard> {
    return this.flashcardService.remove(id, user.sub);
  }
}
