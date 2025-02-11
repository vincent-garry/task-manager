import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TimeLogsService } from './time-logs.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('time-logs')
@UseGuards(JwtAuthGuard)
export class TimeLogsController {
    constructor(private readonly timeLogsService: TimeLogsService) {}
  
    @Post()
    async create(@Body() createTimeLogDto: CreateTimeLogDto, @Request() req) {
      return this.timeLogsService.create(createTimeLogDto, req.user.userId);
    }
  
    @Get('task/:taskId')
    async findAllForTask(@Param('taskId') taskId: string, @Request() req) {
      return this.timeLogsService.findAllForTask(+taskId, req.user.userId);
    }
  }