import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userExamId')
  async getCategoryInsights(
    @Param('userExamId') userExamId: string,
    @Query('userId') userId: string,
  ) {
    const result = await this.recommendationService.generateTagInsights(userExamId, userId);
    return result; // directly return array of { category, accuracy, message }
  }
}