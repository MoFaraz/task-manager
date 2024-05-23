import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { Task } from '@prisma/client';
import { TaskStatus } from '@prisma/client';

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

  async findAllTasks(): Promise<Task[]> {
    return this.prismaService.task.findMany();
  }

  async findTaskById(id: string): Promise<Task> {
    return this.prismaService.task.findUnique({
      where: { id },
    });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    
    return this.prismaService.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: string): Promise<Task> {
    return this.prismaService.task.delete({
      where: { id },
    });
  }
}
