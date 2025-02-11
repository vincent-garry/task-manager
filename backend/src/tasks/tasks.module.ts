import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TimeLogsModule } from '../time-logs/time-logs.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
    forwardRef(() => TimeLogsModule),
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}