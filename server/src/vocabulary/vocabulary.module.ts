import { forwardRef, Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './entities/vocabulary.entity';
import { FlashcardModule } from 'src/flashcard/flashcard.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
    forwardRef(() => FlashcardModule),
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
