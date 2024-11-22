import { forwardRef, Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocabulary, VocabularySchema } from './entities/vocabulary.entity';
import { FlashcardModule } from 'src/flashcard/flashcard.module';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
    ]),
    UserModule,
    forwardRef(() => FlashcardModule),
    CloudinaryModule,
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
