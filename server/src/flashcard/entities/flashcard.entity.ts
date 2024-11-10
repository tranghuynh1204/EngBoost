import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FlashcardDocument = HydratedDocument<Flashcard>;
@Schema()
export class Flashcard {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  user: string;
}

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
