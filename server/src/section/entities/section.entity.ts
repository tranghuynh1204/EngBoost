import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Group, GroupSchema } from './group.entity';
export type SectionDocument = HydratedDocument<Section>;

@Schema()
export class Section {
  @Prop()
  name: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  questionCount: number;

  @Prop({ type: [GroupSchema] })
  groups: Group[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
