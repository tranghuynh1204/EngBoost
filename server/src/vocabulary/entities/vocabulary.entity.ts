import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  mean: string;

  @Prop()
  image: string;

  @Prop({ type: [String], maxlength: 10 }) // Tối đa 10 câu ví dụ
  examples: string[];

  @Prop()
  notes: string;

  @Prop()
  Pronunciation: string;

  @Prop()
  partOfSpeech: string;

  @Prop({ required: true })
  flashcard: Types.ObjectId;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
