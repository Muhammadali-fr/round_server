import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MailerModule,
    ProductModule,
    UserModule,
    TagModule
  ]
})
export class AppModule { }
