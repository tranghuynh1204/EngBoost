import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vocabulary } from './entities/vocabulary.entity';
import { FlashcardService } from 'src/flashcard/flashcard.service';

@Injectable()
export class VocabularyService {
  constructor(
    private readonly flashcardService: FlashcardService,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto, userId: string) {
    let flashcardId = createVocabularyDto.flashcard;

    if (!createVocabularyDto.flashcard) {
      const flashcard = await this.flashcardService.create(
        createVocabularyDto.createFlashcardDto,
        userId,
      );
      flashcardId = flashcard.id;
    }
    await this.flashcardService.findOne(flashcardId.toString());

    const createdVocabulary = new this.vocabularyModel({
      ...createVocabularyDto,
      flashcard: new Types.ObjectId(flashcardId),
    });

    return createdVocabulary.save();
  }

  findAll() {
    return `This action returns all vocabulary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return `This action updates a #${id} vocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulary`;
  }
}
