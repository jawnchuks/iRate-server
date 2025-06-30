import { ApiProperty } from '@nestjs/swagger';

export class MessageEvent {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  messageId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ description: 'Type of event (VIEWED, SCREENSHOT, DELETED, etc.)' })
  type!: string;

  @ApiProperty()
  createdAt!: Date;
}
