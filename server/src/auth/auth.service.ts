import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
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
}
