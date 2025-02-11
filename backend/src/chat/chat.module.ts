import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './models/conversation.model';
import { Message } from './models/message.model';
import { ChatNotification } from './models/notification.model';
import { ConversationParticipant } from './models/conversation-participant.model';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Conversation,
      Message,
      ChatNotification,
      ConversationParticipant
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}