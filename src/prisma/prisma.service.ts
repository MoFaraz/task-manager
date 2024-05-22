import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { timeStampMiddleware } from './middleware/timestamps.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    this.$use(timeStampMiddleware)
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
