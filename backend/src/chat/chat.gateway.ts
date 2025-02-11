import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  import { JwtService } from '@nestjs/jwt';
  
  @WebSocketGateway({
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedUsers = new Map<number, string>();
  
    constructor(
      private chatService: ChatService,
      private jwtService: JwtService,
    ) {}
  
    async handleConnection(client: Socket) {
      try {
        const token = client.handshake.auth.token?.split(' ')[1];
        if (!token) {
          client.disconnect();
          return;
        }
  
        const decoded = this.jwtService.verify(token);
        this.connectedUsers.set(decoded.sub, client.id);
        
        // Envoyer le statut en ligne aux autres utilisateurs
        this.server.emit('userOnline', decoded.sub);
      } catch (error) {
        client.disconnect();
      }
    }
  
    handleDisconnect(client: Socket) {
      let userId: number | null = null;
      this.connectedUsers.forEach((socketId, uid) => {
        if (socketId === client.id) {
          userId = uid;
          this.connectedUsers.delete(uid);
        }
      });
  
      if (userId) {
        this.server.emit('userOffline', userId);
      }
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: {
      content: string;
      conversationId: number;
    }) {
      try {
        const token = client.handshake.auth.token?.split(' ')[1];
        const decoded = this.jwtService.verify(token);
  
        const message = await this.chatService.createMessage({
          content: payload.content,
          senderId: decoded.sub,
          conversationId: payload.conversationId,
        });
  
        const conversation = await this.chatService.getConversationById(payload.conversationId);
        
        // Envoyer le message à tous les participants de la conversation
        conversation.participants.forEach(participant => {
          if (participant.id !== decoded.sub) {
            const socketId = this.connectedUsers.get(participant.id);
            if (socketId) {
              this.server.to(socketId).emit('newMessage', {
                message,
                conversationId: conversation.id,
              });
            }
          }
        });
  
        return message;
      } catch (error) {
        console.error('Error handling message:', error);
      }
    }
  
    @SubscribeMessage('typing')
    async handleTyping(client: Socket, payload: {
      conversationId: number;
      isTyping: boolean;
    }) {
      const token = client.handshake.auth.token?.split(' ')[1];
      const decoded = this.jwtService.verify(token);
  
      const conversation = await this.chatService.getConversationById(payload.conversationId);
      
      conversation.participants.forEach(participant => {
        if (participant.id !== decoded.sub) {
          const socketId = this.connectedUsers.get(participant.id);
          if (socketId) {
            this.server.to(socketId).emit('userTyping', {
              userId: decoded.sub,
              conversationId: conversation.id,
              isTyping: payload.isTyping,
            });
          }
        }
      });
    }
  }