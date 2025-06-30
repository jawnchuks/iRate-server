import { ApiProperty } from '@nestjs/swagger';
import { ChatRequestStatus } from '@prisma/client';

export class ChatRequest {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  senderId!: string;

  @ApiProperty()
  receiverId!: string;

  @ApiProperty({ enum: ChatRequestStatus })
  status!: ChatRequestStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ description: 'Optional initial message with request' })
  message?: string;

  @ApiProperty({ description: 'Group support (if needed)' })
  groupId?: string;
}
