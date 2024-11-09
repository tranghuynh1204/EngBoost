import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Section } from 'src/section/entities/section.entity';

export type UserExamDocument = HydratedDocument<UserExam>;

@Schema()
export class UserExam {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  exam: Types.ObjectId;

  @Prop({ ref: 'Section' })
  sections: Section[];

  @Prop()
  answers: Map<string, string>;

  @Prop({ type: Date }) // Thêm thuộc tính thời gian làm bài
  startTime: Date;

  @Prop({ type: Date }) // Thêm thuộc tính thời gian kết thúc làm bài
  endTime: Date;
}

export const UserExamSchema = SchemaFactory.createForClass(UserExam);
