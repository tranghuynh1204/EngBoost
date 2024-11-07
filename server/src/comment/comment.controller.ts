import { Controller, Post, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('exam/:examId')
  async addCommentToExam(
    @Param('examId') examId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.addCommentToExam(examId, '1', createCommentDto);
  }

  @Post('reply/:commentId')
  async replyToComment(
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.replyToComment(commentId, '1', createCommentDto);
  }
}
