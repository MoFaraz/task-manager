import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService){}

    async createUser (createUserDto: CreateUserDto): Promise<User> {
        const {username ,email ,password ,role} = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prismaService.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
              role,
            },
          });
    }

  async updateUser(id: string ,updateUser: UpdateUserDto): Promise<User> {
    const {username, email, password, role} = updateUser;
    const hashedPassword = (password) ? await bcrypt.hash(password, 10) : undefined;
    return this.prismaService.user.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
        username,
        role,
      }
    });
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
