import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional } from 'class-validator';

export class VerificationSessionDto {
  @ApiProperty({ description: 'Face recognition data', required: false })
  @IsOptional()
  @IsString()
  faceData?: string;

  @ApiProperty({ description: 'URL to verification photo', required: false })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiProperty({ description: 'URL to verification video', required: false })
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({ description: 'Additional metadata for verification', required: false })
  @IsOptional()
  @IsString()
  metadata?: string;
}
