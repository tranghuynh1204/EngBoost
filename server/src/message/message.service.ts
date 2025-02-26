import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async getRecentMessages(userId: string, skip: number) {
    const messages = await this.messageModel
      .find({ user: new Types.ObjectId(userId) })
      .skip(skip)
      .limit(15)
      .sort({ _id: -1 })
      .exec();
    return messages;
  }

  async addMessage(userId: string, content: string, isAdmin: boolean) {
    const savedMessage = await this.messageModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId() }, // Điều kiện để tạo mới
        { user: new Types.ObjectId(userId), content, isAdmin }, // Dữ liệu cập nhật
        { new: true, upsert: true }, // Tùy chọn: trả về tài liệu mới nhất, tạo nếu không tồn tại
      )
      .populate('user', 'name');
    return savedMessage;
  }

  async getInBox() {
    return this.messageModel.aggregate([
      {
        $sort: { timestamp: -1 }, // Sắp xếp tin nhắn theo thời gian giảm dần (tin nhắn mới nhất trước)
      },
      {
        $group: {
          _id: '$user', // Nhóm theo user
          latestMessage: { $first: '$$ROOT' }, // Lấy tin nhắn đầu tiên (mới nhất do đã sắp xếp theo createdAt)
        },
      },
      {
        $lookup: {
          from: 'users', // Collection 'users'
          localField: '_id', // Trường _id từ group (user)
          foreignField: '_id', // Trường _id trong collection users
          as: 'userDetails', // Lưu kết quả vào userDetails
        },
      },
      {
        $unwind: '$userDetails', // Giải nén mảng userDetails để lấy thông tin người dùng
      },
      {
        $project: {
          _id: 0, // Không lấy _id từ group
          user: {
            _id: '$userDetails._id',
            name: '$userDetails.name', // Lấy name từ userDetails
          }, // Lấy userId từ userDetails
          content: '$latestMessage.content', // Lấy nội dung của tin nhắn mới nhất
        },
      },
    ]);
  }
}
