import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async addCommentToExam(
    @Body() createCommentDto: CreateCommentDto,
    @User() user,
  ): Promise<Comment> {
    return this.commentService.addCommentToExam(user.sub, createCommentDto);
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
