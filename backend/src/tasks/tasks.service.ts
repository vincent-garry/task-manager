import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async create(CreateTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.taskModel.create({ ...CreateTaskDto, userId });
  }

  async findAll(userId: number): Promise<Task[]> {
    return this.taskModel.findAll({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    return this.taskModel.findOne({ where: { id, userId } });
  }

  async update(id: number, updateData: Partial<Task>, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    if(!task) {
      return null;
    }
    return task.update(updateData);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    if(task) {
      await task.destroy();
    }
  }
}