import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    userId: Types.ObjectId;
  }> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Sai mật khẩu', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
        expiresIn: process.env.REFRESH_JWT_EXPIRATION_TIME,
      }),
      userId: payload.sub,
    };
  }
  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const token = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
      });

      const user = await this.userService.findOneById(token.sub);
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
      const payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_JWT_SECRET_KEY,
          expiresIn: process.env.REFRESH_JWT_EXPIRATION_TIME,
        }),
      };
    } catch {
      throw new HttpException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = this.generateOtp();
    await this.mailService.sendResetPasswordEmail(email, otp);

    const otpToken = this.jwtService.sign({ email, otp }, { expiresIn: '5m' });
    return { message: 'OTP sent to email', otpToken };
  }

  async resetPassword(otp: string, newPassword: string, otpToken: string) {
    let decoded;
    try {
      decoded = this.jwtService.verify(otpToken); // Kiểm tra token
    } catch (error) {
      // Xử lý các lỗi khi token không hợp lệ hoặc đã hết hạn
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('OTP token has expired.'); // Token hết hạn
      } else {
        throw new UnauthorizedException('Invalid OTP token.'); // Token không hợp lệ
      }
    }
    if (decoded.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.userService.findOne(decoded.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.updatePassword(user.id, newPassword);

    return { message: 'Password updated successfully' };
  }
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP 6 chữ số
  }
}
