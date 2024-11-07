import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop()
  content: string;

  @Prop({ type: [String] })
  options: string[];

  @Prop()
  correctAnswer: string;

  @Prop()
  serial: string;

  @Prop()
  tag: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
