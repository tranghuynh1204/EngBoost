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
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @User() user) {
    return this.commentService.create(user, createCommentDto);
  }

  @Get('by-exam')
  async getCommentsByExam(
    @Query('examId') examId: string,
    @Query('offset') offset: number,
  ): Promise<Comment[]> {
    return this.commentService.getCommentsByExam(examId, offset);
  }
}
