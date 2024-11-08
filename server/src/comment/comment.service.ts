import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ExamService } from 'src/exam/exam.service';

@Injectable()
export class CommentService {
  constructor(
    @Inject(forwardRef(() => ExamService))
    private readonly examService: ExamService,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async addCommentToExam(
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const newComment = new this.commentModel({
      content: createCommentDto.content,
      user: userId,
    });
    const comment = await newComment.save();

    await this.examService.addComment(createCommentDto.examId, comment.id);

    return comment;
  }

  async replyToComment(
    commentId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    try {
      const parentComment = await this.commentModel.findById(commentId).exec();
      if (!parentComment) {
        throw new NotFoundException();
      }
    } catch {
      throw new NotFoundException();
    }
    const newReply = new this.commentModel({
      content: createCommentDto.content,
      user: userId,
      exam: createCommentDto.examId,
    });

    const reply = await newReply.save();
    await this.commentModel.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply.id } },
      { new: true },
    );
    return newReply;
  }

  async getCommentToExamAndCount(
    comments: Comment[],
    id: string,
  ): Promise<{ comments: Comment[]; commentCount: number }> {
    const replies = await this.commentModel
      .find({ exam: id }, { exam: 0 })
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

    return {
      comments: comments,
      commentCount: comments.length + replies.length,
    };
  }
}
