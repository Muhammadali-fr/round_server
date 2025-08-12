import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [PrismaModule, JwtModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
