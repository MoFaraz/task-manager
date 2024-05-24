import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Query, HttpException, HttpStatus, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/gaurds/jwtAuth.gaurd';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { Task } from '@prisma/client';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';

export const storage = {
  storage: diskStorage({
    destination: './uploads/task-files',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    }
  })
}

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Post('create')
    async create(@Req() req, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(req.user.sub, createTaskDto);
    }

    @Get('')
    async findAll(@Query() query, @Req() req): Promise<Task[]> {
        return this.tasksService.findAllTasks(+query.skip, +query.take, req.user.sub);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req) {
        return this.tasksService.findTaskById(id, req.user.sub);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
        try {
            return this.tasksService.updateTask(id, updateTaskDto, req.user.sub)
          } catch (error) {
            console.log(error)
            throw new HttpException({
              status: HttpStatus.FORBIDDEN,
              error: 'Please Try Again',
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
          }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req) {
        return this.tasksService.deleteTask(id, req.user.sub);
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Param('id') taskId): Promise<string> {
        return this.tasksService.updateTaskFile(taskId, file.filename);
    }

    @Get('task-file/:filename')
    findProfileImage(@Param('filename') imagename, @Res() res): Observable<Object> {
        try {
            return of(res.sendFile(join(process.cwd(), 'uploads/task-files/' + imagename)));
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
