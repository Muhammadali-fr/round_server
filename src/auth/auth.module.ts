import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, JwtModule, MailerModule, AwsModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
