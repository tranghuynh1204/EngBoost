import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashcardDto {
  @IsNotEmpty({ message: 'Nội dung tiêu đề không được để trống.' })
  @IsString({ message: 'Nội dung tiêu đề phải là chuỗi ký tự.' })
  title: string;

  @IsNotEmpty({ message: 'Nội dung mô tả không được để trống.' })
  @IsString({ message: 'Nội dung mô tả phải là chuỗi ký tự.' })
  description: string;
}
