import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true, // Đặt global: true ở đây
      useFactory: async () => ({
        secret: jwtConfig().secret,
        signOptions: jwtConfig().signOptions,
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
