import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @ApiProperty({
    description: 'Email notification preferences',
    required: false,
  })
  @IsObject()
  @IsOptional()
  email?: {
    newMatches?: boolean;
    newMessages?: boolean;
    newRatings?: boolean;
    profileViews?: boolean;
    marketing?: boolean;
  };

  @ApiProperty({
    description: 'Push notification preferences',
    required: false,
  })
  @IsObject()
  @IsOptional()
  push?: {
    newMatches?: boolean;
    newMessages?: boolean;
    newRatings?: boolean;
    profileViews?: boolean;
    marketing?: boolean;
  };

  @ApiProperty({
    description: 'SMS notification preferences',
    required: false,
  })
  @IsObject()
  @IsOptional()
  sms?: {
    newMatches?: boolean;
    newMessages?: boolean;
    newRatings?: boolean;
    profileViews?: boolean;
    marketing?: boolean;
  };
}
