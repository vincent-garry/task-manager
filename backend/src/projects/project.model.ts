import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Task } from '../tasks/task.model';

@Table({
    tableName: 'projects',
    timestamps: true,
})
export class Project extends Model<Project> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.ENUM('low', 'medium', 'hight'),
        allowNull: false,
    })
    priority: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    dueDate: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Task)
    tasks: Task[];

    @Column({
        type: DataType.ENUM('active', 'completed', 'on_hold'),
        allowNull: false,
        defaultValue: 'active',
    })
    status: string;
}