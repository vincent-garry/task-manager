import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TimeLogsModule } from './time-logs/time-logs.module';
import { ProjectsModule } from './projects/projects.module';
import { ConfigService } from '@nestjs/config';
import { Project } from './projects/project.model';
import { Task } from './tasks/task.model';
import { User } from './users/user.model';
import { TimeLog } from './time-logs/time-log.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.production',
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadModels: true,
        synchronize: false,
        models: [Project, Task, User, TimeLog],  // Explicitly list models
      }),
    }),

    AuthModule,
    UsersModule,
    TasksModule,
    TimeLogsModule,
    AnalyticsModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
