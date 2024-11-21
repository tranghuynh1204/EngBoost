import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExamModule } from './exam/exam.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelService } from './excel/excel.service';
import { UserExamModule } from './user-exam/user-exam.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),

    MongooseModule.forRoot(process.env.DATABASE_URL),
    ExamModule,
    UserExamModule,
    CommentModule,
    AuthModule,
    FlashcardModule,
    VocabularyModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExcelService],
})
export class AppModule { }
