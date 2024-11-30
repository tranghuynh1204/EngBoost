import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type MessageDocument = HydratedDocument<Message>;
@Schema()
export class Message {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: User;
  @Prop({ default: Date.now })
  timestamp: Date;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  isAdmin: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
