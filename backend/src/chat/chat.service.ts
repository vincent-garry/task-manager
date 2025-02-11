import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Conversation } from './models/conversation.model';
import { Message } from './models/message.model';
import { ChatNotification } from './models/notification.model';
import { ConversationParticipant } from './models/conversation-participant.model';
import { User } from '../users/user.model';
import { Op } from 'sequelize';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Conversation)
        private conversationModel: typeof Conversation,
        @InjectModel(Message)
        private messageModel: typeof Message,
        @InjectModel(ChatNotification)
        private notificationModel: typeof ChatNotification,
        @InjectModel(ConversationParticipant)
        private participantModel: typeof ConversationParticipant,
      ) {}

  async createConversation(data: {
    name?: string;
    isGroup: boolean;
    participantIds: number[];
    creatorId: number;
  }) {
    const conversation = await this.conversationModel.create({
      name: data.name,
      isGroup: data.isGroup,
    });

    await Promise.all(
      [...data.participantIds, data.creatorId].map(userId =>
        this.participantModel.create({
          conversationId: conversation.id,
          userId,
        })
      )
    );

    return this.getConversationById(conversation.id);
  }

  async getConversationById(id: number) {
    return this.conversationModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'participants',
          through: { attributes: [] },
        },
        {
          model: Message,
          include: [{ model: User, as: 'sender' }],
          limit: 20,
          order: [['createdAt', 'DESC']],
        },
      ],
    });
  }

  async getUserConversations(userId: number) {
    return this.conversationModel.findAll({
      include: [
        {
          model: User,
          as: 'participants',
          through: { attributes: [] },
        },
        {
          model: Message,
          include: [{ model: User, as: 'sender' }],
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
      where: {
        '$participants.id$': userId,
      },
      order: [[Message, 'createdAt', 'DESC']],
    });
  }

  async createMessage(data: {
    content: string;
    senderId: number;
    conversationId: number;
  }) {
    const message = await this.messageModel.create({
      content: data.content,
      senderId: data.senderId,
      conversationId: data.conversationId,
    });

    return this.messageModel.findOne({
      where: { id: message.id },
      include: [{ model: User, as: 'sender' }],
    });
  }

  async markMessagesAsRead(conversationId: number, userId: number) {
    await this.messageModel.update(
      { isRead: true },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          isRead: false,
        }
      }
    );

    await this.notificationModel.update(
      { isRead: true },
      {
        where: {
          recipientId: userId,
          isRead: false,
          '$message.conversationId$': conversationId,
        }
      }
    );
  }

  async getUnreadCount(userId: number) {
    return this.notificationModel.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
  }
}