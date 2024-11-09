import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Role } from 'src/shared/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: {
    virtuals: true, // Bật các virtual fields
    versionKey: false, // Loại bỏ __v
    transform: (doc, ret) => {
      delete ret.password; // Xóa password khi trả về JSON
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
