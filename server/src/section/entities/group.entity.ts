import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Question } from './question.entity';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop()
  audio: string;

  @Prop()
  image: string;

  @Prop()
  documentText: string;

  @Prop()
  transcript: string;

  @Prop()
  questions: Question[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
