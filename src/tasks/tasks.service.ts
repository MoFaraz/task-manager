import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prismaService.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
  }

  async findAllTasks(skip: number, take:number, userId: string): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: { userId },
      skip,
      take
    });
  }

  async findTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });
    if (!task)
      throw new NotFoundException('Task not Found')
    if (task.userId !== userId)
      throw new ForbiddenException('Access To this task is forbidden')
    return task;
  }

  async updateTask(id: string, updateTask: UpdateTaskDto, userId: string): Promise<Task> {
    await this.findTaskById(id, userId);
    return this.prismaService.task.update({
      where: { id },
      data: updateTask 
    });
  }

  async updateTaskFile(id: string, file: string): Promise<string> {
    const newUser = await this.prismaService.task.update({
      where: { id },
      data: {
        file
      }
    })
    if (!newUser)
      throw new NotFoundException('User not found')
    return  file 
  }
  async deleteTask(id: string, userId: string): Promise<Task> {
    await this.findTaskById(id, userId)
    return this.prismaService.task.delete({
      where: { id },
    });
  }
}
