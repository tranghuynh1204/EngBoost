import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Flashcard } from './entities/flashcard.entity';
import { Model, Types } from 'mongoose';
import { VocabularyService } from 'src/vocabulary/vocabulary.service';

@Injectable()
export class FlashcardService {
  constructor(
    @Inject(forwardRef(() => VocabularyService))
    private readonly vocabularyService: VocabularyService,
    @InjectModel(Flashcard.name) private flashcardModel: Model<Flashcard>,
  ) {}

  async create(createFlashcardDto: CreateFlashcardDto, userId: string) {
    const newFlashcard = new this.flashcardModel({
      ...createFlashcardDto,
      user: userId,
    });
    return newFlashcard.save();
  }

  async findAll(
    userId: string,
    currentPage: number = 1,
    pageSize: number = 10,
  ) {
    const totalFlashcards = await this.flashcardModel
      .countDocuments({ user: userId })
      .exec();

    const totalPages = Math.ceil(totalFlashcards / pageSize);

    const flashcards = await this.flashcardModel.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'vocabularies',
          localField: '_id',
          foreignField: 'flashcard',
          as: 'vocabularies',
        },
      },
      {
        $addFields: {
          vocabularyCount: { $size: '$vocabularies' },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          vocabularyCount: 1,
        },
      },
      {
        $skip:
          Number.isInteger(currentPage - 1) && Number.isInteger(pageSize)
            ? (currentPage - 1) * pageSize
            : 0,
      },
      { $limit: pageSize > 0 && Number.isInteger(pageSize) ? pageSize : 10 },
    ]);

    return {
      data: flashcards,
      totalPages,
      currentPage,
      pageSize,
    };
  }

  async findOne(id: string, userId: string) {
    const [flashcard] = await this.flashcardModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'vocabularies',
          localField: '_id',
          foreignField: 'flashcard',
          as: 'vocabularies',
        },
      },

      {
        $addFields: {
          vocabularyCount: { $size: '$vocabularies' },
        },
      },

      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          vocabularyCount: 1,
          user: 1,
        },
      },
    ]);
    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy list từ vựng');
    }
    if (flashcard.user.toString() !== userId) {
      throw new ForbiddenException('List từ vựng này không thuộc về bạn');
    }
    return flashcard;
  }

  async update(
    id: string,
    updateFlashcardDto: UpdateFlashcardDto,
    userId: string,
  ) {
    const flashcard = await this.flashcardModel.findById(id);

    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy list từ vựng');
    }

    if (flashcard.user.toString() !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa list từ vựng này',
      );
    }

    return this.flashcardModel
      .findByIdAndUpdate(id, updateFlashcardDto, {
        new: true,
      })
      .lean();
  }

  async remove(id: string, userId: string) {
    const flashcard = await this.flashcardModel.findById(id);

    if (!flashcard) {
      throw new NotFoundException('Không tìm thấy list từ vựng');
    }

    if (flashcard.user.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xoá list từ vựng này');
    }
    const removeFlashcard = await this.flashcardModel
      .findByIdAndDelete(id)
      .exec();

    await this.vocabularyService.removeByFlashcardId(id);
    return removeFlashcard;
  }
}
