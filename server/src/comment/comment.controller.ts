import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
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
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user,
  ): Promise<Comment> {
    return this.commentService.create(user.sub, createCommentDto);
  }

  @Get('by-exam')
  async getCommentsByExam(
    @Query('examId') examId: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<Comment[]> {
    return this.commentService.getCommentsByExam(examId, offset, limit);
  }
}
