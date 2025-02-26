import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Section } from 'src/section/entities/section.entity';

export type ExamDocument = HydratedDocument<Exam>;

@Schema()
export class Exam {
  @Prop()
  title: string;

  @Prop()
  duration: number;

  @Prop()
  category: string;

  @Prop({ ref: 'Section' })
  sections: Section[];

  @Prop()
  questionCount: number;

  @Prop()
  sectionCount: number;

  @Prop({ default: Date.now })
  createAt: Date;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
