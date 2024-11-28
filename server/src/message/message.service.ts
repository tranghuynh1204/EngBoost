import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
  ) {}

  async getRecentMessages(userId: string) {
    const messages = await this.MessageModel.find({ user: userId })

      .limit(15)
      .exec();
    return messages;
  }

  async addMessage(userId: string, content: string, isAdmin: boolean) {
    const newMessage = new this.MessageModel({
      user: userId,
      content,
      isAdmin,
    });

    return await newMessage.save();
  }
}
