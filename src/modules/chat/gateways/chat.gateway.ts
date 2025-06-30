import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../../auth/guards/ws-jwt-auth.guard';
import { ChatService } from '../services/chat.service';
import { CreateMessageDto } from '../dto/chat.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private userSockets: Map<string, Socket> = new Map();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token and get user
      const user = await this.chatService.validateToken(token);
      if (!user) {
        client.disconnect();
        return;
      }

      // Store user's socket
      this.userSockets.set(user.id, client);
      client.data.userId = user.id;

      // Join user's room for private messages
      client.join(`user:${user.id}`);

      // Notify user's online status
      this.server.emit('user:online', { userId: user.id });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      this.server.emit('user:offline', { userId });
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; message: CreateMessageDto },
    @CurrentUser('sub') userId: string,
  ) {
    try {
      const { chatId, message } = data;
      const savedMessage = await this.chatService.sendMessage(chatId, userId, message);

      // Get the conversation and participants
      const conversation = await this.chatService.getRawConversation(chatId);
      if (!conversation) throw new Error('Conversation not found');
      const otherParticipants = conversation.participants.filter((p) => p.id !== userId);
      const recipientIds = otherParticipants.map((p) => p.id);

      // Emit to all recipients (for group or 1:1)
      this.server.to(`user:${userId}`);
      recipientIds.forEach((id) => {
        this.server.to(`user:${id}`);
      });
      this.server.emit('message:new', {
        chatId,
        message: savedMessage,
      });

      return savedMessage;
    } catch (error) {
      if (error instanceof Error) {
        client.emit('error', { message: error.message });
      } else {
        client.emit('error', { message: 'An unexpected error occurred' });
      }
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
    @CurrentUser('sub') userId: string,
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.chatId, userId);

      // Get the conversation and participants
      const conversation = await this.chatService.getRawConversation(data.chatId);
      if (!conversation) throw new Error('Conversation not found');
      const otherParticipants = conversation.participants.filter((p) => p.id !== userId);
      const recipientIds = otherParticipants.map((p) => p.id);

      // Notify all recipients that messages were read
      recipientIds.forEach((id) => {
        this.server.to(`user:${id}`).emit('message:read', {
          chatId: data.chatId,
          readBy: userId,
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        client.emit('error', { message: error.message });
      } else {
        client.emit('error', { message: 'An unexpected error occurred' });
      }
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
    @CurrentUser('sub') userId: string,
  ) {
    const conversation = await this.chatService.getRawConversation(data.chatId);
    if (!conversation) return;
    const otherParticipants = conversation.participants.filter((p) => p.id !== userId);
    const recipientIds = otherParticipants.map((p) => p.id);
    recipientIds.forEach((id) => {
      this.server.to(`user:${id}`).emit('typing:start', {
        chatId: data.chatId,
        userId,
      });
    });
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
    @CurrentUser('sub') userId: string,
  ) {
    const conversation = await this.chatService.getRawConversation(data.chatId);
    if (!conversation) return;
    const otherParticipants = conversation.participants.filter((p) => p.id !== userId);
    const recipientIds = otherParticipants.map((p) => p.id);
    recipientIds.forEach((id) => {
      this.server.to(`user:${id}`).emit('typing:stop', {
        chatId: data.chatId,
        userId,
      });
    });
  }
}
