import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { MessageType } from '@prisma/client';
import { CreateMessageDto } from './create-message.dto';

export { CreateMessageDto };

export class CreateChatRequestDto {
  @ApiProperty({
    description: 'ID of the user to start a chat with',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  targetUserId!: string;
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Chat ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID of the other participant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  participantId!: string;

  @ApiProperty({
    description: 'Last message in the chat',
    example: 'Hello! How are you?',
  })
  lastMessage!: string;

  @ApiProperty({
    description: 'Timestamp of the last message',
    example: '2024-03-15T12:00:00Z',
  })
  lastMessageAt!: Date;

  @ApiProperty({
    description: 'Number of unread messages',
    example: 2,
  })
  unreadCount!: number;

  @ApiProperty({
    description: 'Whether the chat is locked (requires payment)',
    example: false,
  })
  isLocked!: boolean;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Message ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Chat ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chatId!: string;

  @ApiProperty({
    description: 'Sender ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  senderId!: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello! How are you?',
  })
  content!: string;

  @ApiProperty({
    description: 'Message type',
    enum: MessageType,
    example: MessageType.TEXT,
  })
  type!: MessageType;

  @ApiPropertyOptional({
    description: 'Media URL if message type is not TEXT',
    example: 'https://example.com/media/image.jpg',
  })
  mediaUrl?: string;

  @ApiProperty({
    description: 'Message creation timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Whether the message has been read',
    example: false,
  })
  isRead!: boolean;
}

export class ChatRequestResponseDto {
  @ApiProperty({
    description: 'Chat request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID of the user who sent the request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  senderId!: string;

  @ApiProperty({
    description: 'ID of the user who received the request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  receiverId!: string;

  @ApiProperty({
    description: 'Request status',
    enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
    example: 'PENDING',
  })
  status!: string;

  @ApiProperty({
    description: 'Request creation timestamp',
    example: '2024-03-15T12:00:00Z',
  })
  createdAt!: Date;
}
