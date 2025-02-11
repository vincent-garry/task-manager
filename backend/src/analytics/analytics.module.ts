import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Task } from '../tasks/task.model';
import { TimeLog } from '../time-logs/time-log.model';

@Module({
  imports: [SequelizeModule.forFeature([Task, TimeLog])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}