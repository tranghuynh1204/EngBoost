import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vocabulary } from './entities/vocabulary.entity';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { CreateFlashcardDto } from 'src/flashcard/dto/create-flashcard.dto';
import { console } from 'inspector';

@Injectable()
export class VocabularyService {
  constructor(
    @Inject(forwardRef(() => FlashcardService))
    private readonly flashcardService: FlashcardService,
    @InjectModel(Vocabulary.name) private vocabularyModel: Model<Vocabulary>,
  ) {}

  async create(createVocabularyDto: CreateVocabularyDto, userId: string) {
    let flashcardId = createVocabularyDto.flashcard;

    if (!flashcardId) {
      const createFlashcardDto: CreateFlashcardDto =
        createVocabularyDto.createFlashcardDto;
      if (!createFlashcardDto.title || !createFlashcardDto.description) {
        throw new HttpException(
          'Vui lòng điền đầy đủ thông tin của list từ vựng',
          HttpStatus.BAD_REQUEST,
        );
      }
      const flashcard = await this.flashcardService.create(
        createFlashcardDto,
        userId,
      );
      flashcardId = flashcard.id;
    }
    await this.flashcardService.findOne(flashcardId.toString(), userId);

    const createdVocabulary = new this.vocabularyModel({
      ...createVocabularyDto,
      flashcard: new Types.ObjectId(flashcardId),
    });

    return createdVocabulary.save();
  }

  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    userId: string,
  ) {
    const vocabulary = await this.vocabularyModel
      .findById(id)
      .populate('flashcard')
      .lean()
      .exec();

    if (!vocabulary) {
      throw new NotFoundException(`Không tìm thấy từ vựng`);
    }

    if (vocabulary.flashcard.user.toString() !== userId) {
      throw new ForbiddenException(
        `Bạn không có quyền cập nhật từ vựng này này`,
      );
    }
    return this.vocabularyModel
      .findByIdAndUpdate(id, updateVocabularyDto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string) {
    const vocabulary = await this.vocabularyModel
      .findById(id)
      .populate('flashcard')
      .exec();

    if (!vocabulary) {
      throw new NotFoundException(`Không tìm thấy từ vựng`);
    }

    if (vocabulary.flashcard.user.toString() !== userId) {
      throw new ForbiddenException(`Bạn không có quyền xóa vocabulary này`);
    }

    return this.vocabularyModel.findByIdAndDelete(id).exec();
  }

  async removeByFlashcardId(flashcard: string) {
    await this.vocabularyModel.deleteMany({
      flashcard: new Types.ObjectId(flashcard),
    });
  }

  async findByFlashcardId(
    flashcardId: string,
    currentPage: number,
    pageSize: number,
  ) {
    const flashcardObjectId = new Types.ObjectId(flashcardId);

    const totalVocabularies = await this.vocabularyModel
      .countDocuments({ flashcard: flashcardObjectId })
      .exec();

    if (totalVocabularies === 0) {
      throw new NotFoundException(
        'Không tìm thấy từ vựng nào cho flashcard này',
      );
    }

    const totalPages = Math.ceil(totalVocabularies / pageSize);

    if (currentPage > totalPages) {
      throw new NotFoundException('Trang hiện tại vượt quá tổng số trang');
    }

    const vocabularies = await this.vocabularyModel
      .find({ flashcard: flashcardObjectId })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return {
      data: vocabularies,
      totalPages,
      currentPage,
      pageSize,
    };
  }
}
