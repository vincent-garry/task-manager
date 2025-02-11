import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Inject, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TimeLogsService } from '../time-logs/time-logs.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from './task.model';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        @Inject(forwardRef(() => TimeLogsService))
        private readonly timeLogsService: TimeLogsService,
      ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  async findAll(@Request() req): Promise<Task[]> {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<any> {
    const task = await this.tasksService.findOne(+id, req.user.userId);
    if (task) {
      const timeLogs = await this.timeLogsService.findAllForTask(+id, req.user.userId);
      return {
        ...task.get({ plain: true }),
        timeLogs,
      };
    }
    return task;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<Task>,
    @Request() req,
  ): Promise<Task> {
    return this.tasksService.update(+id, updateTaskDto, req.user.userId );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.tasksService.remove(+id, req.user.userId);
  }
}