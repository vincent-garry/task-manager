import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from './project.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { Task } from '../tasks/task.model';

@Injectable()
export class ProjectsService {
    constructor(@InjectModel(Project) private projectModel: typeof Project,) {}

    async create(CreateProjectDto: CreateProjectDto, userId: number): Promise<Project> {
        return this.projectModel.create({...CreateProjectDto, userId});
    }

    async findAll(userId: number): Promise<Project[]> {
        return this.projectModel.findAll({
          where: { userId },
          include: [{
            model: Task,
            attributes: ['id', 'status']
          }],
          order: [['createdAt', 'DESC']]
        });
      }

    async findOne(id: number, userId: number): Promise<Project> {
        return this.projectModel.findOne({
          where: { id, userId },
          include: [{
            model: Task,
            attributes: ['id', 'title', 'status', 'priority', 'timeSpent']
          }],
        });
      }

      async update(id: number, updateProjectDto: Partial<Project>, userId: number): Promise<Project> {
        const project = await this.findOne(id, userId);
        if (!project) return null;
        return project.update(updateProjectDto);
      }

      async remove(id: number, userId: number): Promise<void> {
        const project = await this.findOne(id, userId);
        if (project) {
          await project.destroy();
        }
      }
}