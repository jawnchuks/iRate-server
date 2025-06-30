import { ApiProperty } from '@nestjs/swagger';

export class Chat {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  participantId!: string;

  @ApiProperty()
  participantName!: string;

  @ApiProperty({ required: false })
  participantPhoto?: string;

  @ApiProperty()
  lastMessage!: string;

  @ApiProperty()
  lastMessageAt!: Date;

  @ApiProperty()
  unreadCount!: number;

  @ApiProperty()
  isLocked!: boolean;

  @ApiProperty()
  groupName!: string;

  @ApiProperty()
  participants!: string[];

  @ApiProperty()
  media!: string[];

  @ApiProperty()
  reactions!: string[];

  @ApiProperty()
  events!: string[];

  @ApiProperty()
  calls!: string[];
}
