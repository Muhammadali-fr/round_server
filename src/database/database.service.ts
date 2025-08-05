import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('Connected to database'))
      .catch((err) => {
        console.error(err);
      });
  }
}
