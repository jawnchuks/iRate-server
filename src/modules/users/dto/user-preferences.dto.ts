import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NotificationPreferences {
  @ApiProperty({
    description: 'Whether to receive email notifications',
    example: true,
    required: false,
  })
  @IsOptional()
  email?: boolean;

  @ApiProperty({
    description: 'Whether to receive push notifications',
    example: true,
    required: false,
  })
  @IsOptional()
  push?: boolean;

  @ApiProperty({
    description: 'Whether to receive SMS notifications',
    example: true,
    required: false,
  })
  @IsOptional()
  sms?: boolean;
}

export class UpdatePreferencesDto {
  @ApiProperty({
    description: 'User language preference',
    example: 'en',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    description: 'User timezone',
    example: 'UTC',
    required: false,
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({
    description: 'Notification preferences',
    type: NotificationPreferences,
    required: false,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationPreferences)
  @IsOptional()
  notifications?: NotificationPreferences;
}
