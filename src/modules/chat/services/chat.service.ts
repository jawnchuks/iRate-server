import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionsService } from '../../subscriptions/services/subscriptions.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message as MessageEntity } from '../entities/message.entity';

// Local type for participant
export type Participant = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  profilePicture?: { url?: string } | null;
};

interface ConversationWithParticipants {
  id: string;
  groupName?: string | null;
  updatedAt: Date;
  participants: Participant[];
  messages: { content?: string; createdAt: Date }[];
}

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

    const conversations = (await this.prisma.conversation.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: {
        participants: {
          select: { id: true, firstName: true, lastName: true, profilePicture: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    })) as ConversationWithParticipants[];

    return conversations.map((conv: ConversationWithParticipants) => {
      const otherParticipant = conv.participants.find((p: Participant) => p.id !== userId);
      const lastMessage = conv.messages[0];
      return {
        id: conv.id,
        groupName: conv.groupName || '',
        participants: conv.participants.map((p: Participant) => p.id),
        participantId: otherParticipant?.id || '',
        participantName: otherParticipant
          ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
          : '',
        participantPhoto: otherParticipant?.profilePicture?.url || undefined,
        lastMessage: lastMessage?.content || '',
        lastMessageAt: lastMessage?.createdAt || conv.updatedAt,
        unreadCount: 0,
        isLocked: false,
        media: [],
        reactions: [],
        events: [],
        calls: [],
      };
    });
  }

  async getMessages(chatId: string, userId: string, page: number = 1, limit: number = 20) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p: Participant) => p.id === userId)) {
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
        isRead: false,
      },
      data: { isRead: true },
    });

    // Clear unread count in Redis
    await this.redis.del(`${this.UNREAD_COUNT_KEY}${chatId}:${userId}`);

    // Map to Message entity structure
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content ?? '',
      type: msg.type,
      senderId: msg.senderId,
      conversationId: msg.conversationId,
      read: msg.isRead ?? false,
      isDeleted: msg.isDeleted ?? false,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      deletedAt: msg.deletedAt ?? null,
      isEdited: msg.isEdited ?? false,
      editedAt: msg.editedAt ?? null,
      mediaUrl: msg.mediaUrl ?? '',
      attachments: [],
      reactions: [],
      events: [],
      viewOnce: msg.viewOnce ?? false,
      expiresAt: msg.expiresAt ?? new Date(0),
    }));
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p: Participant) => p.id === senderId)) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const msg = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        type: createMessageDto.type,
        sender: { connect: { id: senderId } },
        conversation: { connect: { id: conversationId } },
      },
    });

    // Map to Message entity structure
    return {
      id: msg.id,
      content: msg.content ?? '',
      type: msg.type,
      senderId: msg.senderId,
      conversationId: msg.conversationId,
      read: msg.isRead ?? false,
      isDeleted: msg.isDeleted ?? false,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      deletedAt: msg.deletedAt ?? null,
      isEdited: msg.isEdited ?? false,
      editedAt: msg.editedAt ?? null,
      mediaUrl: msg.mediaUrl ?? '',
      attachments: [],
      reactions: [],
      events: [],
      viewOnce: msg.viewOnce ?? false,
      expiresAt: msg.expiresAt ?? new Date(0),
    };
  }

  async deleteConversation(chatId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p: Participant) => p.id === userId)) {
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
    await this.redis.del(
      `${this.UNREAD_COUNT_KEY}${chatId}:${conversation.participants.find((p: Participant) => p.id !== userId)?.id}`,
    );
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
          participants: {
            connect: [{ id: userId }, { id: request.senderId }],
          },
        },
        include: {
          participants: true,
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

  async getRawConversation(chatId: string): Promise<ConversationWithParticipants | null> {
    return (await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: { id: true, firstName: true, lastName: true, profilePicture: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true },
        },
      },
    })) as ConversationWithParticipants | null;
  }

  async getConversation(chatId: string, userId: string) {
    const conversation = (await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: { id: true, firstName: true, lastName: true, profilePicture: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true },
        },
      },
    })) as ConversationWithParticipants | null;

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p: Participant) => p.id === userId)) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    const otherParticipant = conversation.participants.find((p: Participant) => p.id !== userId);
    const lastMessage = conversation.messages[0];
    return {
      id: conversation.id,
      groupName: conversation.groupName || '',
      participants: conversation.participants.map((p: Participant) => p.id),
      participantId: otherParticipant?.id || '',
      participantName: otherParticipant
        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
        : '',
      participantPhoto: otherParticipant?.profilePicture?.url || undefined,
      lastMessage: lastMessage?.content || '',
      lastMessageAt: lastMessage?.createdAt || conversation.updatedAt,
      unreadCount: 0,
      isLocked: false,
      media: [],
      reactions: [],
      events: [],
      calls: [],
    };
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.some((p: Participant) => p.id === userId)) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId: chatId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    // Clear unread count in Redis
    await this.redis.del(
      `${this.UNREAD_COUNT_KEY}${chatId}:${conversation.participants.find((p: Participant) => p.id !== userId)?.id}`,
    );
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

  /**
   * Create a new group chat
   * @param creatorId - ID of the user creating the group
   * @param groupName - Name of the group
   * @param participantIds - Array of user IDs to add to the group (excluding creator)
   * @returns The created group chat
   */
  async createGroupChat(creatorId: string, groupName: string, participantIds: string[]) {
    if (!groupName || !participantIds || participantIds.length === 0) {
      throw new Error('Group name and at least one participant are required');
    }
    // Ensure creator is included
    const allParticipants = Array.from(new Set([creatorId, ...participantIds]));
    const groupChat = await this.prisma.conversation.create({
      data: {
        isGroup: true,
        groupName,
        participants: {
          connect: allParticipants.map((id: string) => ({ id })),
        },
      },
      include: {
        participants: {
          select: { id: true, firstName: true, lastName: true, profilePicture: true },
        },
      },
    });
    return groupChat;
  }
}
