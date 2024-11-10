import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flashcard } from './entities/flashcard.entity';
import { Model } from 'mongoose';

@Injectable()
export class FlashcardService {
  constructor(
    @InjectModel(Flashcard.name) private flashcardModel: Model<Flashcard>,
  ) {}

  async create(createFlashcardDto: CreateFlashcardDto, userId: string) {
    const newFlashcard = new this.flashcardModel({
      ...createFlashcardDto,
      user: userId,
    });
    return newFlashcard.save();
  }

  findAll() {
    return `This action returns all flashcard`;
  }

  async findOne(id: string) {
    const flashcard = await this.flashcardModel.findById(id).exec();
    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy flashcard');
    }
    return flashcard;
  }

  update(id: number, updateFlashcardDto: UpdateFlashcardDto) {
    return `This action updates a #${id} flashcard`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashcard`;
  }
}
