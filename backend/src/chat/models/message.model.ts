import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { Conversation } from './conversation.model';

@Table
export class Message extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  content: string;

  @ForeignKey(() => User)
  @Column
  senderId: number;

  @ForeignKey(() => Conversation)
  @Column
  conversationId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isRead: boolean;

  @BelongsTo(() => User)
  sender: User;

  @BelongsTo(() => Conversation)
  conversation: Conversation;
}