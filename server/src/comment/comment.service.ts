import { forwardRef, Inject, Injectable } from '@nestjs/common';

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
    examId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const newComment = new this.commentModel({
      content: createCommentDto.content,
      user: userId,
    });
    const comment = await newComment.save();

    await this.examService.addComment(examId, comment.id);

    return comment;
  }

  async replyToComment(
    commentId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const newReply = new this.commentModel({
      content: createCommentDto.content,
      user: userId,
    });

    const reply = await newReply.save();
    await this.commentModel.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply.id } },
      { new: true },
    );
    return reply;
  }

  async getReplies(comments: Comment[]): Promise<Comment[]> {
    const queue: Comment[] = [...comments];

    // Duyệt qua các comment trong hàng đợi
    while (queue.length > 0) {
      const currentComment = queue.shift(); // Lấy comment đầu tiên trong hàng đợi

      if (currentComment) {
        // Nếu comment có replies, truy vấn thêm
        if (currentComment.replies && currentComment.replies.length > 0) {
          const replies = await this.commentModel
            .find({ _id: { $in: currentComment.replies } })
            .exec();

          currentComment.replies = replies; // Gán lại replies vào comment

          // Thêm các replies vào hàng đợi để xử lý tiếp
          queue.push(...replies);
        }
      }
    }

    return comments; // Trả về danh sách comment đã được xử lý và cập nhật replies
  }
}
