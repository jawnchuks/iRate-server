import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionsService } from '../../subscriptions/services/subscriptions.service';
import { Message } from '@prisma/client';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class ChatService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly UNREAD_COUNT_KEY = 'unread_count:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async getConversations(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    });

    return conversations.map((conv) => {
      const otherParticipant =
        conv.participant1Id === userId ? conv.participant2 : conv.participant1;
      const lastMessage = conv.messages[0];

      return {
        id: conv.id,
        participantId: otherParticipant.id,
        participantName: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
        participantPhoto: otherParticipant.profilePicture?.url,
        lastMessage: lastMessage?.content || '',
        lastMessageAt: lastMessage?.createdAt || conv.updatedAt,
        unreadCount: 0, // Will be fetched from Redis
        isLocked: false, // Will be determined by payment status
      };
    });
  }

  async getMessages(chatId: string, userId: string, page: number = 1, limit: number = 20) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: {
        participant1: true,
        participant2: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    const skip = (page - 1) * limit;

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: chatId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId: chatId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    // Clear unread count in Redis
    await this.redis.del(`${this.UNREAD_COUNT_KEY}${chatId}:${userId}`);

    return messages;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participant1: true,
        participant2: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1Id !== senderId && conversation.participant2Id !== senderId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        type: createMessageDto.type,
        sender: { connect: { id: senderId } },
        conversation: { connect: { id: conversationId } },
      },
    });

    return message;
  }

  async deleteConversation(chatId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    // Soft delete all messages
    await this.prisma.message.updateMany({
      where: { conversationId: chatId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Delete conversation
    await this.prisma.conversation.delete({
      where: { id: chatId },
    });

    // Clear Redis cache
    await this.redis.del(`${this.UNREAD_COUNT_KEY}${chatId}:${conversation.participant1Id}`);
    await this.redis.del(`${this.UNREAD_COUNT_KEY}${chatId}:${conversation.participant2Id}`);
  }

  async getChatRequests(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    return this.prisma.chatRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  async createChatRequest(userId: string, targetUserId: string) {
    // Check if users exist
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.user.findUnique({ where: { id: targetUserId } }),
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    // Check if there's already a pending request
    const existingRequest = await this.prisma.chatRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      throw new ForbiddenException('A chat request already exists');
    }

    // Create new chat request
    return this.prisma.chatRequest.create({
      data: {
        senderId: userId,
        receiverId: targetUserId,
        status: 'PENDING',
      },
    });
  }

  async acceptChatRequest(requestId: string, userId: string) {
    const request = await this.prisma.chatRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Chat request not found');
    }

    if (request.receiverId !== userId) {
      throw new ForbiddenException('You cannot accept this chat request');
    }

    if (request.status !== 'PENDING') {
      throw new ForbiddenException('This chat request is no longer pending');
    }

    // Start a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Update request status
      await prisma.chatRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          participant1Id: request.senderId,
          participant2Id: request.receiverId,
        },
      });

      return conversation;
    });
  }

  async declineChatRequest(requestId: string, userId: string) {
    const request = await this.prisma.chatRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Chat request not found');
    }

    if (request.receiverId !== userId) {
      throw new ForbiddenException('You cannot decline this chat request');
    }

    if (request.status !== 'PENDING') {
      throw new ForbiddenException('This chat request is no longer pending');
    }

    return this.prisma.chatRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' },
    });
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
    } catch {
      return null;
    }
  }

  async getRawConversation(chatId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async getConversation(chatId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    const otherParticipant =
      conversation.participant1Id === userId
        ? conversation.participant2
        : conversation.participant1;
    const lastMessage = conversation.messages[0];

    return {
      id: conversation.id,
      participantId: otherParticipant.id,
      participantName: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
      participantPhoto: otherParticipant.profilePicture?.url,
      lastMessage: lastMessage?.content || '',
      lastMessageAt: lastMessage?.createdAt || conversation.updatedAt,
      unreadCount: 0,
      isLocked: false,
    };
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId: chatId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    // Clear unread count in Redis
    await this.redis.del(`${this.UNREAD_COUNT_KEY}${chatId}:${userId}`);
  }

  async deleteMessage(chatId: string, messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
