import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserexamdraftDto {
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

  selectedTime: number;
}
