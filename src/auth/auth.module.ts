import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AppJwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [DatabaseModule, AppJwtModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
