export class ExamDto {
  title: string;

  duration: number;

  category: string;

  sectionCount: number;

  questionCount: number;

  commentCount: number;

  userCount: number;

  static mapExamToDto(examEntity: any): any {
    const examDto = new ExamDto();
    examDto.title = examEntity.title;
    examDto.duration = examEntity.duration;
    examDto.category = examEntity.category;
    examDto.sectionCount = examEntity.sectionCount;
    examDto.questionCount = examEntity.questionCount;
    examDto.commentCount = examEntity.commentCount;
    examDto.userCount = examEntity.userCount;
    return examDto;
  }
}
