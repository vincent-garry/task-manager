import { Table, Column, Model, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import { User } from '../../users/user.model';
import { Message } from './message.model';
import { ConversationParticipant } from './conversation-participant.model';

@Table
export class Conversation extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isGroup: boolean;

  @BelongsToMany(() => User, () => ConversationParticipant)
  participants: User[];

  @HasMany(() => Message)
  messages: Message[];
}