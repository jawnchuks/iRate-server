import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportUserDto {
  @ApiProperty({ description: 'ID of the user to report' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ description: 'Reason for reporting' })
  @IsString()
  reason!: string;

  @ApiProperty({ description: 'Additional details', required: false })
  @IsOptional()
  @IsString()
  details?: string;
}
