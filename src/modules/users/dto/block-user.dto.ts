import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockUserDto {
  @ApiProperty({ description: 'ID of the user to block' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Reason for blocking', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
