import {
    Table,
    Column,
    Model,
    DataType,
    Unique,
    IsEmail
} from 'sequelize-typescript';

@Table({
    tableName: 'users',
    timestamps: true
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    username: string;

    @Unique
    @IsEmail
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;
}