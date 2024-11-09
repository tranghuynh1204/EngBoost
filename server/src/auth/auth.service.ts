import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
  ): Promise<{ access_token: string }> {
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
    };
  }
}
