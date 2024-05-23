import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGaurd } from 'src/common/gaurds/roles.gaurd';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGaurd
    }
  ],
  controllers: [UsersController]
})
export class UsersModule {}
