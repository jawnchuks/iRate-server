import { ApiProperty } from '@nestjs/swagger';

export class UserStatusDto {
  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  isDeactivated!: boolean;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty({ required: false })
  deactivatedAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;
}
