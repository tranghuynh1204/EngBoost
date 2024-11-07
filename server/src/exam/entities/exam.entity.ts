import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Comment } from 'src/comment/entities/comment.entity';
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

  @Prop({ ref: 'Comment' })
  comments: Comment[];
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
