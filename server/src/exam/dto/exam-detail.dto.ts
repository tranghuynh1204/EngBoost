import { SectionDto } from 'src/section/entities/section.dto';
import { ExamDto } from './exam.dto';

export class ExamDetailDto extends ExamDto {
  sections: SectionDto[];
  comments: Comment[];
  static mapExamToDto(examEntity: any): ExamDetailDto {
    const examDetailDto = super.mapExamToDto(examEntity); // Gọi phương thức mapExamToDto từ lớp cha

    examDetailDto.sections = SectionDto.mapSectionsToDtos(examEntity.sections);
    examDetailDto.comments = examEntity.comments;

    return examDetailDto;
  }
}
