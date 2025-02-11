import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getUserConversations(@Request() req) {
    return this.chatService.getUserConversations(req.user.userId);
  }

  @Post('conversations')
  async createConversation(
    @Request() req,
    @Body() createConversationDto: {
      name?: string;
      isGroup: boolean;
      participantIds: number[];
    }
  ) {
    return this.chatService.createConversation({
      ...createConversationDto,
      creatorId: req.user.userId,
    });
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatService.getConversationById(+id);
  }

  @Get('conversations/:id/messages')
  async getConversationMessages(@Param('id') id: string) {
    return this.chatService.getConversationById(+id);
  }

  @Post('conversations/:id/read')
  async markConversationAsRead(
    @Param('id') id: string,
    @Request() req
  ) {
    return this.chatService.markMessagesAsRead(+id, req.user.userId);
  }

  @Get('notifications/unread-count')
  async getUnreadCount(@Request() req) {
    return this.chatService.getUnreadCount(req.user.userId);
  }
}