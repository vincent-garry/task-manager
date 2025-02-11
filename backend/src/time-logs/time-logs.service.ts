import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimeLog } from './time-log.model';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TimeLogsService {
    constructor(
        @InjectModel(TimeLog)
        private timeLogModel: typeof TimeLog,
        @Inject(forwardRef(() => TasksService))
        private tasksService: TasksService,
    ) {}

  async create(createTimeLogDto: CreateTimeLogDto, userId: number): Promise<TimeLog> {
    // Vérifier que la tâche appartient à l'utilisateur
    const task = await this.tasksService.findOne(createTimeLogDto.taskId, userId);
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    // Créer l'enregistrement de temps
    const timeLog = await this.timeLogModel.create({
      taskId: createTimeLogDto.taskId,
      timeSpent: createTimeLogDto.timeSpent,
      description: createTimeLogDto.description,
    });

    // Mettre à jour le temps total de la tâche
    const totalTimeSpent = await this.getTotalTimeForTask(task.id);
    await task.update({ timeSpent: totalTimeSpent });

    return timeLog;
  }

  private async getTotalTimeForTask(taskId: number): Promise<number> {
    const logs = await this.timeLogModel.findAll({
      where: { taskId },
    });
    return logs.reduce((total, log) => total + log.timeSpent, 0);
  }

  async findAllForTask(taskId: number, userId: number): Promise<TimeLog[]> {
    // Vérifier que la tâche appartient à l'utilisateur
    const task = await this.tasksService.findOne(taskId, userId);
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    return this.timeLogModel.findAll({
      where: { taskId },
      order: [['logDate', 'DESC']],
    });
  }
}