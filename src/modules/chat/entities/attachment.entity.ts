import { ApiProperty } from '@nestjs/swagger';

export class Attachment {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  url!: string;

  @ApiProperty({ description: 'Type of attachment (image, video, audio, file, etc.)' })
  type!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  size!: number;

  @ApiProperty()
  createdAt!: Date;
}
