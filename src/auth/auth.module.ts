import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppJwtModule } from '../jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AwsModule } from 'src/lib/aws/aws.module';

@Module({
  imports: [PrismaModule, AppJwtModule, MailerModule, AwsModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
