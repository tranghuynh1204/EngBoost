import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  mean: string;

  @Prop()
  image: string;

  @Prop()
  example: string;

  @Prop()
  notes: string;

  @Prop()
  pronunciation: string;

  @Prop()
  partOfSpeech: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Flashcard',
    required: true,
  })
  flashcard: Flashcard;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
