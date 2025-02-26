// create-comment.dto.ts
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống.' })
  @IsString({ message: 'Nội dung bình luận phải là chuỗi ký tự.' })
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Không tìm thấy bài thi' })
  examId: string;

  @IsString()
  @IsOptional()
  @IsMongoId({ message: 'Không tìm thấy comment được rep' })
  repToCommentId: string;
}
