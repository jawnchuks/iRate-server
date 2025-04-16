import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVisibilityDto {
  @ApiProperty({
    description: 'Whether profile is visible in search results',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisibleInSearch?: boolean;

  @ApiProperty({
    description: 'Whether profile is visible to nearby users',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisibleToNearby?: boolean;

  @ApiProperty({
    description: 'Whether profile is visible to recommended users',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisibleToRecommended?: boolean;
}
