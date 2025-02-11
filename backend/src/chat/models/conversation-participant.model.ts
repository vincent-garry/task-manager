import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { Conversation } from './conversation.model';

@Table
export class ConversationParticipant extends Model {
  @ForeignKey(() => Conversation)
  @Column
  conversationId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Conversation)
  conversation: Conversation;

  @BelongsTo(() => User)
  user: User;
}