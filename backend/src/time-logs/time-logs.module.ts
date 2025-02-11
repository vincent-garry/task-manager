import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TimeLog } from './time-log.model';
import { TimeLogsService } from './time-logs.service';
import { TimeLogsController } from './time-logs.controller';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TimeLog]),
    forwardRef(() => TasksModule),
  ],
  providers: [TimeLogsService],
  controllers: [TimeLogsController],
  exports: [TimeLogsService],
})
export class TimeLogsModule {}