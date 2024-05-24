import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, Req, UseInterceptors, UploadedFile, Res, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGaurd } from 'src/common/gaurds/roles.gaurd';
import { JwtAuthGuard } from 'src/common/gaurds/jwtAuth.gaurd';
import { OmitUser } from 'src/auth/interfaces/auth.interface';
import { diskStorage } from 'multer';
import path, { extname, join } from 'path';
import {v4 as uuidv4} from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profile-image',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    }
  })
}

@Controller('users')
@UseGuards(RolesGaurd, JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  @Roles('ADMIN')
  async findAll(@Query() query): Promise<OmitUser[]> {
    return this.usersService.findAll(+query.skip, +query.take);
  }

  @Get(':username')
  @Roles('ADMIN', 'USER')
  async findOne(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Put('update/:id')
  @Roles('ADMIN')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string): Promise<User> {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Put('')
  @Roles('ADMIN', 'USER')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req): Promise<User> {
    return this.usersService.updateProfile(updateUserDto, req.user.sub);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Req() req): Promise<string> {
    const user = req.user.sub;

    return this.usersService.updateProfileImage(user, file.filename);
  }

  @Get('profile-image/:imagename')
  findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    try {
      return of(res.sendFile(join(process.cwd(), 'uploads/profile-image/' + imagename)));
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Please Try Again',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
}