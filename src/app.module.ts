import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    // for .env 
    ConfigModule.forRoot({
      isGlobal: true
    }),

    // other stuf 
    PrismaModule,
    AuthModule,
    MailerModule,
    ProductModule,
    UserModule,
    CategoryModule,
    CartModule
  ]
})
export class AppModule { }
