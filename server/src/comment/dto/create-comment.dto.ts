// create-comment.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống.' })
  @IsString({ message: 'Nội dung bình luận phải là chuỗi ký tự.' })
  content: string;

  @IsNotEmpty()
  @IsString()
  examId: string;

  @IsString()
  @IsOptional()
  repToCommentId: string;
}
