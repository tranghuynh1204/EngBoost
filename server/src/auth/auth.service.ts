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

  // Helper method to clean and validate expiresIn values
  private getValidExpiresIn(envValue: string | undefined, fallback: string = '7d'): string {
    if (!envValue) return fallback;
    
    let cleaned = envValue.trim().replace(/['"]/g, '');
    
    // Validate format
    if (!/^\d+[smhdwy]?$/i.test(cleaned) && !/^\d+$/.test(cleaned)) {
      console.warn(`Invalid expiresIn format: "${envValue}", using fallback: "${fallback}"`);
      return fallback;
    }
    
    return cleaned;
  }

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

    // Get clean refresh token expiration
    const refreshExpiresIn = this.getValidExpiresIn(
      process.env.REFRESH_JWT_EXPIRATION_TIME,
      '30d' // Default fallback for refresh tokens
    );

    console.log('Signing tokens with expiresIn:', refreshExpiresIn);

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_JWT_SECRET_KEY,
        expiresIn: refreshExpiresIn,
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

      // Get clean refresh token expiration
      const refreshExpiresIn = this.getValidExpiresIn(
        process.env.REFRESH_JWT_EXPIRATION_TIME,
        '30d'
      );

      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_JWT_SECRET_KEY,
          expiresIn: refreshExpiresIn,
        }),
      };
    } catch (error) {
      console.error('Refresh token error:', error.message);
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

    // Use explicit valid format for OTP token
    const otpToken = await this.jwtService.signAsync(
      { email, otp }, 
      { expiresIn: '5m' } // This is a valid format
    );
    
    return { message: 'OTP sent to email', otpToken };
  }

  async resetPassword(otp: string, newPassword: string, otpToken: string) {
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(otpToken);
    } catch (error) {
      console.error('OTP token verification error:', error.message);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('OTP token has expired.');
      } else {
        throw new UnauthorizedException('Invalid OTP token.');
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
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}