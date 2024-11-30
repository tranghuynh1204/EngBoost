import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;
@Schema()
export class Message {
  @Prop({ required: true })
  user: string;
  @Prop({ default: Date.now })
  timestamp: Date;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  isAdmin: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
