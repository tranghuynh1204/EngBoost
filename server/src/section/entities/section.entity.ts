import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Question, QuestionSchema } from './question.entity';
export type SectionDocument = HydratedDocument<Section>;

@Schema()
export class Section {
  @Prop()
  name: string;

  @Prop({ type: [QuestionSchema] })
  questions: Question[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  questionCount: number;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
