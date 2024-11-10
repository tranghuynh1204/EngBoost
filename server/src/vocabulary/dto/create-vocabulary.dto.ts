// create-vocabulary.dto.ts
import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  ArrayMaxSize,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateFlashcardDto } from 'src/flashcard/dto/create-flashcard.dto';

export class CreateVocabularyDto {
  @IsNotEmpty({ message: 'Từ vựng không được để trống.' })
  @IsString({ message: 'Từ vựng bình luận phải là chuỗi ký tự.' })
  word: string;

  @IsNotEmpty({ message: 'Định nghĩa không được để trống.' })
  @IsString({ message: 'Định nghĩa luận phải là chuỗi ký tự.' })
  mean: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  examples?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  pronunciation?: string;

  @IsOptional()
  @IsString()
  partOfSpeech?: string;

  @IsOptional()
  @IsMongoId({ message: 'Không tìm thấy flashcard' })
  flashcard: Types.ObjectId;

  @IsOptional()
  createFlashcardDto: CreateFlashcardDto;
}
