import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVocabularyDto {
  @IsNotEmpty({ message: 'Từ vựng không được để trống.' })
  @IsString({ message: 'Từ vựng bình luận phải là chuỗi ký tự.' })
  word: string;

  @IsNotEmpty({ message: 'Định nghĩa không được để trống.' })
  @IsString({ message: 'Định nghĩa luận phải là chuỗi ký tự.' })
  mean: string;

  @IsOptional()
  @IsString()
  example?: string;

  image: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  pronunciation?: string;

  @IsOptional()
  @IsString()
  partOfSpeech?: string;
}
