import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { TimeLog } from '../time-logs/time-log.model';
import { Project } from '../projects/project.model';

@Table({
    tableName: 'tasks',
    timestamps: true,
})
export class Task extends Model<Task> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.ENUM('todo', 'in_progress', 'done'),
        defaultValue: 'todo',
    })
    status: string;

    @Column({
        type: DataType.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
    })
    priority: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    startDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    dueDate: Date;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    estimatedTime: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    timeSpent: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Project)
    @Column
    projectId: number;

    @BelongsTo(() => Project)
    project: Project;
}