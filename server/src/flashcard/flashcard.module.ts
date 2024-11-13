import { forwardRef, Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flashcard, FlashcardSchema } from './entities/flashcard.entity';
import { VocabularyModule } from 'src/vocabulary/vocabulary.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
    ]),
    UserModule,
    forwardRef(() => VocabularyModule),
  ],
  controllers: [FlashcardController],
  providers: [FlashcardService],
  exports: [FlashcardService],
})
export class FlashcardModule {}
