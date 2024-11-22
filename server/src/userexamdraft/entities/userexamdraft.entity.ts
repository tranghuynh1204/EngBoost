import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Exam } from 'src/exam/entities/exam.entity';
import { Section } from 'src/section/entities/section.entity';

export type UserExamDraftDocument = HydratedDocument<UserExamDraft>;

@Schema()
export class UserExamDraft {
  @Prop({ required: true })
  user: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Exam' })
  exam: Exam;

  @Prop({ ref: 'Section' })
  sections: Section[];

  @Prop()
  answers: Map<string, string>;

  @Prop()
  mapSectionCategory: Map<string, { correct: number; questionCount: number }>;

  @Prop({ type: Date }) // Thêm thuộc tính thời gian làm bài
  startTime: Date;

  @Prop({ required: true })
  duration: number;

  @Prop()
  result: string;
}

export const UserExamDraftSchema = SchemaFactory.createForClass(UserExamDraft);
