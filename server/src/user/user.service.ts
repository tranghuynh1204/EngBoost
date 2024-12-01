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

  async findOneById(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
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
      roles: [Role.USER],
    });

    return createdUser.save();
  }

  async statistics(days: number) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days); // Tính ngày bắt đầu

    // Thống kê người dùng theo ngày
    const stats = await this.userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sinceDate }, // Lọc người dùng theo khoảng thời gian
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // Nhóm theo ngày
          },
          count: { $sum: 1 }, // Đếm số lượng người dùng
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo ngày tăng dần
      },
    ]);

    // Tính tổng số người dùng trong khoảng thời gian
    const total = stats.reduce((sum, stat) => sum + stat.count, 0);

    // Chuyển đổi dữ liệu từ MongoDB format sang đối tượng dễ đọc
    const formattedStats = stats.map((stat) => ({
      key: stat._id,
      value: stat.count,
    }));

    // Trả về kết quả bao gồm tổng số người dùng và thống kê theo ngày
    return {
      total, // Tổng số người dùng
      data: formattedStats, // Thống kê theo ngày
    };
  }

  async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );
  }
}
