import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserExamDto {
  @IsNotEmpty()
  exam: string;

  @IsArray()
  sections: string[];

  @IsOptional()
  answers: Map<string, string>;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  duration: number;
}
