import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacyDto {
  @ApiProperty({
    description: 'Whether the profile is public',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isProfilePublic?: boolean;

  @ApiProperty({
    description: 'Whether ratings are public',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  areRatingsPublic?: boolean;

  @ApiProperty({
    description: 'Whether location is public',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isLocationPublic?: boolean;

  @ApiProperty({
    description: 'Whether contact information is public',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isContactPublic?: boolean;
}
