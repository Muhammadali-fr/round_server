import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [DatabaseModule, ProductModule, AuthModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
