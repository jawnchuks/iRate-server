import { ApiProperty } from '@nestjs/swagger';

export class Reaction {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Emoji used for the reaction' })
  emoji!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  messageId!: string;

  @ApiProperty()
  createdAt!: Date;
}
