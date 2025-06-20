import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UserModule,
    ConfigModule, // required for ConfigService to work
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET_KEY');
        const expiresIn = configService.get<string>('JWT_EXPIRATION_TIME')?.trim()?.replace(/['"]/g, '') || '7d';
    
        console.log('JWT_SECRET_KEY =', secret);
        console.log('JWT_EXPIRATION_TIME =', expiresIn);
    
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [AuthService, MailService], //  keep MailService inline
  controllers: [AuthController],
})
export class AuthModule {}
