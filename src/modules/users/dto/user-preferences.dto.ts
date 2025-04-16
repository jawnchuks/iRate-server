import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserPreferencesDto {
  @ApiPropertyOptional({ description: 'Receive push notifications' })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Receive email notifications' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Profile visibility: public/private' })
  @IsOptional()
  @IsString()
  profileVisibility?: 'public' | 'private';

  @ApiPropertyOptional({ description: 'Hide rating from others' })
  @IsOptional()
  @IsBoolean()
  hideRating?: boolean;

  @ApiPropertyOptional({ description: 'Who can message: all/matches' })
  @IsOptional()
  @IsString()
  whoCanMessage?: 'all' | 'matches';
}
