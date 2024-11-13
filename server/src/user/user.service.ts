import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/shared/enums/role.enum';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async checkExists(id: string): Promise<boolean> {
    const exists = await this.userModel.exists({ _id: new Types.ObjectId(id) });
    return exists !== null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      roles: [Role.USER, Role.MODERATOR],
    });

    return createdUser.save();
  }
}
