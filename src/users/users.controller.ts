import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGaurd } from 'src/common/gaurds/roles.gaurd';
import { JwtAuthGuard } from 'src/common/gaurds/jwtAuth.gaurd';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGaurd, JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @Roles('ADMIN')
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles('ADMIN', 'USER')
    async findOne(@Param('id') id: string): Promise<User> {
      return this.usersService.findById(id);
    }

    @Post()
    @Roles('ADMIN')
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.usersService.createUser(createUserDto);
    }

    @Put('update')
    @Roles('ADMIN')
    async update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.updateUser(updateUserDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    async delete(@Param('id')id: string): Promise<User> {
        return this.usersService.deleteUser(id);
    }
  }