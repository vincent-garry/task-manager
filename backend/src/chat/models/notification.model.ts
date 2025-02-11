// src/chat/models/notification.model.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { Message } from './message.model';

@Table
export class ChatNotification extends Model {
  @ForeignKey(() => User)
  @Column
  recipientId: number;

  @ForeignKey(() => Message)
  @Column
  messageId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isRead: boolean;

  @BelongsTo(() => User)
  recipient: User;

  @BelongsTo(() => Message)
  message: Message;
}