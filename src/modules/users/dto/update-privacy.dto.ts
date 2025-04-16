import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacyDto {
  @ApiProperty({
    description: 'Whether profile is visible to public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isProfilePublic?: boolean;

  @ApiProperty({
    description: 'Whether ratings are visible to public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  areRatingsPublic?: boolean;

  @ApiProperty({
    description: 'Whether location is visible to public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isLocationPublic?: boolean;

  @ApiProperty({
    description: 'Whether contact information is visible to public',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isContactPublic?: boolean;
}
