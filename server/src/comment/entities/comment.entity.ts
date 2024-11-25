import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true, ref: 'User' })
  user: string;

  @Prop()
  exam: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop()
  rootId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ ref: 'Comment' })
  replies: Comment[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
