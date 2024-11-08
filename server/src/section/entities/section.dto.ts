export class SectionDto {
  name: string;

  tags: string[];

  questionCount: number;

  static mapSectionToDto(sectionEntity: any): SectionDto {
    const sectionDto = new SectionDto();
    sectionDto.name = sectionEntity.name;
    sectionDto.tags = sectionEntity.tags || []; // Đảm bảo mảng tags không null
    sectionDto.questionCount = sectionEntity.questionCount || 0; // Đảm bảo có giá trị mặc định

    return sectionDto;
  }

  // Hàm map cho số nhiều (mảng phần thi)
  static mapSectionsToDtos(sectionsEntity: any[]): SectionDto[] {
    return sectionsEntity.map((section) => this.mapSectionToDto(section)); // Sử dụng mapSectionToDto cho từng phần thi
  }
}
