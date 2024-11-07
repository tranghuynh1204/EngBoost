import { IsArray, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserExamDto {
  @IsNotEmpty()
  exam: number;

  @IsArray()
  sections: string[];

  @IsOptional() // Để cho phép không cần cung cấp
  answers: Map<number, string>;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}
