// recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { UserExam, UserExamSchema } from '../user-exam/entities/user-exam.entity';
import { SectionModule } from '../section/section.module';   // 👈 add this line

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserExam.name, schema: UserExamSchema }]),
    SectionModule,  // 👈 brings SectionService into the DI context
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
