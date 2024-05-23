import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/gaurds/jwtAuth.gaurd';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/updateTask.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Post('create')
    async create(@Req() req, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
        const userId = req.user.sub;
        return this.tasksService.createTask(userId, createTaskDto);
    }

    @Get('')
    async findAll(): Promise<Task[]> {
        return this.tasksService.findAllTasks();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tasksService.findTaskById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, updateTaskDto: UpdateTaskDto) {
        return this.tasksService.updateTask(id, updateTaskDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tasksService.deleteTask(id);
    }
}
