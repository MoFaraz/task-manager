import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Get All Users'})
    @ApiResponse({ status:200, description: 'Success'/*, type: User */})
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'Success'/*, type: User */})
    async findOne(@Param('id') id: string): Promise<User> {
      return this.usersService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'Created'/*, type: User */})
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.usersService.createUser(createUserDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiResponse({ status: 200, description: 'Updated'/*, type: User */})
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiResponse({ status: 200, description: 'Deleted'/*, type: User */})
    async delete(@Param('id') id: string): Promise<User> {
        return this.usersService.deleteUser(id);
    }



}
