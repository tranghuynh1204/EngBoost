import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from 'src/auth/decorator/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post('exam/:examId')
  async addCommentToExam(
    @Param('examId') examId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user,
  ): Promise<Comment> {
    return this.commentService.addCommentToExam(
      examId,
      user.sub,
      createCommentDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post('reply/:commentId')
  async replyToComment(
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user,
  ): Promise<Comment> {
    return this.commentService.replyToComment(
      commentId,
      user.sub,
      createCommentDto,
    );
  }
}
