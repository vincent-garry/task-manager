import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class UserSettings extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  emailNotifications: boolean;

  @Column
  pushNotifications: boolean;

  @Column
  theme: string;

  @Column
  language: string;

  @BelongsTo(() => User)
  user: User;
}