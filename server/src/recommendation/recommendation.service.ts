import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserExam,
  UserExamDocument,
} from '../user-exam/entities/user-exam.entity';
import { SectionService } from '../section/section.service';

export interface TagFeedback {
  tag: string;
  correct: number;
  total: number;
  accuracy: number; // 0 .. 1
  level: 'Excellent' | 'Good' | 'Needs Improvement';
  message: string;
}

export interface SectionFeedback {
  section: string; // e.g. "Part 6"
  category: string; // Listening / Reading
  overallAccuracy: number; // 0 .. 1
  level: 'Excellent' | 'Good' | 'Needs Improvement';
  message: string; // feedback at section level
  tagFeedbacks: TagFeedback[];
}

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(UserExam.name) private userExamModel: Model<UserExamDocument>,
    private readonly sectionService: SectionService,
  ) {}

  private classify(
    accuracy: number,
  ): 'Excellent' | 'Good' | 'Needs Improvement' {
    if (accuracy >= 0.85) return 'Excellent';
    if (accuracy >= 0.6) return 'Good';
    return 'Needs Improvement';
  }

  private buildMessage(
    scope: string,
    accuracy: number,
    correct: number,
    total: number,
  ): string {
    if (accuracy >= 0.85)
      return `Fantastic work in ${scope}! (${correct}/${total} correct)`;
    if (accuracy >= 0.6)
      return `You're doing fairly well in ${scope}, but there's room to improve. (${correct}/${total} correct)`;
    return `You need more practice in ${scope}. You got only ${correct}/${total} right.`;
  }

  /**
   * Generate detailed feedback per section and per tag.
   */
  async generateTagInsights(
    userExamId: string,
    userId: string,
  ): Promise<SectionFeedback[]> {
    // 1. Load UserExam with answers
    const userExam = await this.userExamModel
      .findOne({
        _id: new Types.ObjectId(userExamId),
        user: new Types.ObjectId(userId),
      })
      .exec();

    if (!userExam) throw new NotFoundException('UserExam not found');

    // Convert answers to quick lookup map
    const answerMap: Record<string, string> = userExam.answers as any; // serial -> chosen option

    // 2. Load Section docs (they contain tags & questions)
    const sectionIds = (
      userExam.sections as unknown as (Types.ObjectId | string)[]
    ).map((id) => new Types.ObjectId(id));
    const sections = await this.sectionService.findByIds(sectionIds);

    // 3. Iterate each section to build tag stats
    const result: SectionFeedback[] = [];

    for (const section of sections) {
      const tagStats: Record<string, { correct: number; total: number }> = {};
      let sectionCorrect = 0;
      let sectionTotal = 0;

      for (const group of section.groups) {
        for (const q of group.questions) {
          // a question may have multiple tags; iterate each
          for (const tag of q.tags) {
            if (!tagStats[tag]) tagStats[tag] = { correct: 0, total: 0 };
            tagStats[tag].total += 1;
          }
          // check correctness once per question
          const chosen = answerMap[q.serial.toString()];
          const correct = chosen && chosen === q.correctAnswer;
          if (correct) {
            sectionCorrect += 1;
            for (const tag of q.tags) tagStats[tag].correct += 1;
          }
          sectionTotal += 1;
        }
      }

      // Build TagFeedback array
      const tagFeedbacks: TagFeedback[] = Object.entries(tagStats).map(
        ([tag, stats]) => {
          const acc = stats.correct / stats.total;
          const lvl = this.classify(acc);
          return {
            tag,
            correct: stats.correct,
            total: stats.total,
            accuracy: parseFloat(acc.toFixed(2)),
            level: lvl,
            message: this.buildMessage(
              `tag \"${tag}\"`,
              acc,
              stats.correct,
              stats.total,
            ),
          };
        },
      );

      // Section-level classification
      const sectionAcc = sectionCorrect / sectionTotal;
      const sectionLevel = this.classify(sectionAcc);

      result.push({
        section: section.name,
        category: section.category,
        overallAccuracy: parseFloat(sectionAcc.toFixed(2)),
        level: sectionLevel,
        message: this.buildMessage(
          `section ${section.name}`,
          sectionAcc,
          sectionCorrect,
          sectionTotal,
        ),
        tagFeedbacks,
      });
    }

    return result;
  }
}
