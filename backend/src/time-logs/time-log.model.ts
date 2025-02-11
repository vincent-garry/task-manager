import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Task } from '../tasks/task.model';

@Table({
    tableName: 'time_logs',
    timestamps: true,
})
export class TimeLog extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @ForeignKey(() => Task)
    @Column
    taskId: number;

    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    timeSpent: number; // en minutes
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
    })
    logDate: Date;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    description: string;
  
    @BelongsTo(() => Task)
    task: Task;
}