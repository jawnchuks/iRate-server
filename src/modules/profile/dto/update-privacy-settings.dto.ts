import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacySettingsDto {
  @ApiProperty({
    description: 'Whether the profile is public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isProfilePublic?: boolean;

  @ApiProperty({
    description: 'Whether ratings are public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  areRatingsPublic?: boolean;

  @ApiProperty({
    description: 'Whether location is public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isLocationPublic?: boolean;

  @ApiProperty({
    description: 'Whether contact information is public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isContactPublic?: boolean;

  @ApiProperty({
    description: 'Whether the user is visible in search',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisibleInSearch?: boolean;

  @ApiProperty({
    description: 'Whether the user is visible to nearby users',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisibleToNearby?: boolean;

  @ApiProperty({
    description: 'Whether the user is visible in recommendations',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisibleToRecommended?: boolean;
}
