import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OmitUser } from 'src/auth/interfaces/auth.interface';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService){}

    async createUser (createUserDto: CreateUserDto): Promise<User> {
        const {username ,email ,password} = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = (createUserDto.role == 'ADMIN') ? Role.ADMIN : Role.USER;
        

        const newUser = this.prismaService.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
              role,
            },
          });
        delete (await newUser).password
        return newUser
    }

  async updateUser(updateUser: UpdateUserDto, id: string): Promise<User> {
    const { password, role } = updateUser;
    const hashedPassword = (password) ? await bcrypt.hash(password, 10) : undefined;
    const newUser = this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        role,
      }
    });
    delete (await newUser).password    
    return newUser
  }

  async updateProfile(updateUser: UpdateUserDto, id: string): Promise<User> {
    const {email, phone, password, profilePicture} = updateUser; 
    const hashedPassword = (password) ? await bcrypt.hash(password, 10) : undefined;
    const newUser = this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        email,
        phone,
        profilePicture
      }
    });

    delete (await newUser).password
    return newUser;

  }
  async updateProfileImage(id: string, profilePicture: string): Promise<string> {
    const newUser = await this.prismaService.user.update({
      where: { id },
      data: {
        profilePicture
      }
    })
    if (!newUser)
      throw new NotFoundException('User not found')
    return profilePicture
  }
  async findAll(skip?: number, take?: number): Promise<OmitUser[]> {
    const users = await this.prismaService.user.findMany({
      skip,
      take
    });
    return users.map((user) => {
      const {password, ...userWithoutPassword} = user;
      return userWithoutPassword;
    })
  }

  async findById(id: string): Promise<User|undefined> {
    const newUser = this.prismaService.user.findUnique({ where: { id }});
    delete (await newUser).password
    return newUser
  }

  async findByUsername(username: string): Promise<User|undefined> {
    const newUser = this.prismaService.user.findUnique({ where: { username }});
    delete (await newUser).password
    return newUser
  }

  async deleteUser(id: string): Promise<User> {
    return this.prismaService.user.delete({ where: { id }});
  }

  async checkUser(userId: string, id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user)
      throw new NotFoundException('User not Found')
    if (user.id !== userId)
      throw new ForbiddenException('Access To this task is forbidden')
    return user;
  }
}
