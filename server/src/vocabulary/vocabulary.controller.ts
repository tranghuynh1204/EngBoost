import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { User } from 'src/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vocabularies')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() createVocabularyDto: CreateVocabularyDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user,
  ) {
    return this.vocabularyService.create(createVocabularyDto, file, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('bulk-create')
  async bulkCreate(
    @Body() createVocabularyDtos: CreateVocabularyDto[],
    @User() user,
  ) {
    return this.vocabularyService.createBulk(createVocabularyDtos, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
    @User() user,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto, user.sub);
  }

  @Roles(Role.USER)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @User() user) {
    return this.vocabularyService.remove(id, user.sub);
  }

  @Get('flashcards/:flashcardId')
  async getByFlashcard(
    @Param('flashcardId') flashcardId: string,
    @Query('currentPage') currentPage?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const effectivePage = currentPage || 1;
    const effectivePageSize = pageSize || 10;
    return this.vocabularyService.findByFlashcardId(
      flashcardId,
      effectivePage,
      effectivePageSize,
    );
  }
}
