import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(user: any, createCommentDto: CreateCommentDto) {
    let comment;
    if (createCommentDto.repToCommentId) {
      const newReply = new this.commentModel({
        exam: new Types.ObjectId(createCommentDto.examId),
        content: createCommentDto.content,
        user: user.sub,
      });

      const parentComment = await this.commentModel
        .findById(createCommentDto.repToCommentId)
        .exec();
      if (!parentComment) {
        throw new NotFoundException('Không tìm thấy comment được rep');
      }

      newReply.rootId = parentComment.rootId || parentComment.id;

      comment = await newReply.save();

      parentComment.replies.push(comment.id);

      await parentComment.save();
    } else {
      const newComment = new this.commentModel({
        exam: new Types.ObjectId(createCommentDto.examId),
        content: createCommentDto.content,
        user: user.sub,
      });
      comment = await newComment.save();
    }

    return {
      _id: comment.id,
      user: {
        name: user.name,
      },
      content: comment.content,
      replies: [],
      createdAt: comment.createdAt,
    };
  }

  async getCommentCount(examId: string): Promise<number> {
    return await this.commentModel.countDocuments({
      exam: new Types.ObjectId(examId),
    });
  }

  async getCommentsByExam(
    examId: string,
    offset: number = 0,
  ): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({
        exam: new Types.ObjectId(examId),
        rootId: { $exists: false },
      })
      .select('content user replies createdAt')
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .skip(offset)
      .limit(10)
      .exec();

    if (!comments || comments.length === 0) {
      return [];
    }

    const commentIds = comments.map((cmt) => cmt.id);
    const replies = await this.commentModel
      .find({ rootId: { $in: commentIds } })
      .select('content user replies createdAt')
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .exec();

    const commentsMap = new Map<string, Comment>();
    replies.forEach((reply) => {
      commentsMap.set(reply._id.toString(), reply);
    });

    [...comments, ...replies].forEach((item) => {
      item.replies = item.replies
        .map((replyId) => commentsMap.get(replyId.toString()) || null)
        .filter((reply) => reply !== null);
    });

    return comments;
  }
}
