import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionService } from './section.service';
import { Section, SectionSchema } from './entities/section.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
  ],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
