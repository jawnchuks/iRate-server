import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '@prisma/client';
import { Attachment } from './attachment.entity';
import { Reaction } from './reaction.entity';
import { MessageEvent } from './message-event.entity';

export class Message {
  @ApiProperty({ description: 'Unique identifier for the message' })
  id: string = '';

  @ApiProperty({ description: 'Content of the message' })
  content: string = '';

  @ApiProperty({ description: 'Type of message', enum: MessageType })
  type: MessageType = MessageType.TEXT;

  @ApiProperty({ description: 'ID of the sender' })
  senderId: string = '';

  @ApiProperty({ description: 'ID of the conversation' })
  conversationId: string = '';

  @ApiProperty({ description: 'Whether the message has been read' })
  read: boolean = false;

  @ApiProperty({ description: 'Whether the message has been deleted' })
  isDeleted: boolean = false;

  @ApiProperty({ description: 'When the message was created' })
  createdAt: Date = new Date();

  @ApiProperty({ description: 'When the message was last updated' })
  updatedAt: Date = new Date();

  @ApiProperty({ description: 'When the message was deleted', required: false })
  deletedAt: Date | null = null;

  @ApiProperty()
  isEdited!: boolean;

  @ApiProperty({ required: false, nullable: true })
  editedAt!: Date | null;

  @ApiProperty({ description: 'URL of the media message' })
  mediaUrl: string = '';

  @ApiProperty({ description: 'Array of attachment objects' })
  attachments: Attachment[] = [];

  @ApiProperty({ description: 'Array of reaction objects' })
  reactions: Reaction[] = [];

  @ApiProperty({ description: 'Array of message event objects' })
  events: MessageEvent[] = [];

  @ApiProperty({ description: 'Whether the message is view-once' })
  viewOnce: boolean = false;

  @ApiProperty({ description: 'When the message expires' })
  expiresAt: Date = new Date();
}
