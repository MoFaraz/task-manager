import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService){}

    async createUser (createUserDto: CreateUserDto): Promise<User> {
        const {username ,email ,password} = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = (createUserDto.role == 'ADMIN') ? Role.ADMIN : Role.USER;
        

        return this.prismaService.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
              role,
            },
          });
    }

  async updateUser(updateUser: UpdateUserDto): Promise<User> {
    const {username, password, role} = updateUser;
    const hashedPassword = (password) ? await bcrypt.hash(password, 10) : undefined;
    if (hashedPassword)
      return this.prismaService.user.update({
        where: { username },
        data: {
          password: hashedPassword,
          role,
        }
      });
      else 
        return this.prismaService.user.update({
          where: { username},
          data: {
            role
          }
      })
  }

  async updateProfile(updateUser: UpdateUserDto): Promise<User> {
    const {username,email, phone, password} = updateUser; 
    const hashedPassword = (password) ? await bcrypt.hash(password, 10) : undefined;
    const newUser = this.prismaService.user.update({
      where: { username },
      data: {
        password: hashedPassword,
        email,
        phone
      }
    });

    delete (await newUser).password
    return newUser;

  }
  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findById(id: string): Promise<User|undefined> {
    return this.prismaService.user.findUnique({ where: { id }});
  }

  async findByUsername(username: string): Promise<User|undefined> {
    return this.prismaService.user.findUnique({ where: { username }});
  }

  async deleteUser(id: string): Promise<User> {
    return this.prismaService.user.delete({ where: { id }});
  }
}
