import { Injectable } from '@nestjs/common';

import { Section, SectionDocument } from './entities/section.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
  ) {}
  async create(section: Section): Promise<SectionDocument> {
    const newSection = new this.sectionModel(section);
    return newSection.save();
  }
  async findByIds(sectionIds: Types.ObjectId[]): Promise<SectionDocument[]> {
    // Convert string IDs to ObjectId
    return this.sectionModel.find({ _id: { $in: sectionIds } }).exec();
  }
}
