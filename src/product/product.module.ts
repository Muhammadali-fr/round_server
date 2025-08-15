import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  imports: [PrismaModule, AwsModule],
  controllers: [ProductController],
  providers: [ProductService],
})

export class ProductModule { }
