import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../tasks/task.model';
import { TimeLog } from '../time-logs/time-log.model';
import { Sequelize } from 'sequelize-typescript';
import { Op, literal } from 'sequelize';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    @InjectModel(TimeLog)
    private timeLogModel: typeof TimeLog,
  ) {}

  async getDashboardStats(userId: number) {
    try {
      console.log('Getting stats for userId:', userId);

      // Comptage des tâches
      const totalTasks = await this.taskModel.count({ 
        where: { userId } 
      });
      console.log('Total tasks:', totalTasks);

      // Tâches complétées
      const completedTasks = await this.taskModel.count({ 
        where: { 
          userId,
          status: 'done'
        } 
      });
      console.log('Completed tasks:', completedTasks);

      // Temps total cette semaine
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      // Récupérer tous les logs de temps de la semaine
      const weeklyLogs = await this.timeLogModel.findAll({
        where: {
          logDate: {
            [Op.gte]: startOfWeek
          }
        },
        include: [{
          model: Task,
          where: { userId },
          required: true
        }]
      });

      // Calculer le total manuellement
      const weeklyTimeSpent = weeklyLogs.reduce((total, log) => total + log.timeSpent, 0);
      console.log('Weekly time spent:', weeklyTimeSpent);

      return {
        totalTasks,
        completedTasks,
        weeklyTimeSpent
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }

  async getProductivityTrends(userId: number, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    try {
      const results = await this.timeLogModel.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('logDate')), 'date'],
          [Sequelize.fn('SUM', Sequelize.col('timeSpent')), 'totalTime'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'logCount']
        ],
        include: [{
          model: Task,
          where: { userId },
          attributes: [],
          required: true
        }],
        where: {
          logDate: {
            [Op.gte]: startDate
          }
        },
        group: [Sequelize.fn('DATE', Sequelize.col('logDate'))],
        raw: true,
        order: [[Sequelize.fn('DATE', Sequelize.col('logDate')), 'ASC']]
      });
  
      // Formater les résultats
      const formattedResults = results.map(result => ({
        date: result['date'],
        totalTime: Number(result['totalTime']),
        logCount: Number(result['logCount'])
      }));
  
      return formattedResults;
    } catch (error) {
      console.error('Erreur dans getProductivityTrends:', error);
      return [];
    }
  }
}