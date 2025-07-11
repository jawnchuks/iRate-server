import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsObject, IsUrl } from 'class-validator';

/**
 * All fields are optional. Users can update any field one at a time.
 * Grouped into 'basic' and 'settings' sections for clarity.
 */
export class UpdateProfileDto {
  // BASIC SECTION
  @ApiProperty({ description: "User's display name", required: false })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ description: "User's bio or description", required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: "User's interests", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ description: "User's location", required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: "User's self-description", required: false })
  @IsString()
  @IsOptional()
  selfDescription?: string;

  @ApiProperty({ description: 'Values user looks for in others', required: false })
  @IsString()
  @IsOptional()
  valuesInOthers?: string;

  @ApiProperty({ description: "User's profile picture URL", required: false })
  @IsUrl()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({
    description: 'User media (images, videos, etc.)',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  media?: string[];

  @ApiProperty({ description: "User's nationality", required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ description: "User's work", required: false })
  @IsString()
  @IsOptional()
  work?: string;

  @ApiProperty({ description: "User's school", required: false })
  @IsString()
  @IsOptional()
  school?: string;

  @ApiProperty({ description: "User's height", required: false })
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty({ description: "User's religion", required: false })
  @IsString()
  @IsOptional()
  religion?: string;

  @ApiProperty({ description: "User's ethnicity", required: false })
  @IsString()
  @IsOptional()
  ethnicity?: string;

  @ApiProperty({ description: "User's relationship status", required: false })
  @IsString()
  @IsOptional()
  relationshipStatus?: string;

  @ApiProperty({ description: "User's gender", required: false })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ description: "User's zodiac sign", required: false })
  @IsString()
  @IsOptional()
  zodiacSign?: string;

  @ApiProperty({ description: "User's vibe check answer", required: false })
  @IsString()
  @IsOptional()
  vibeCheckAnswers?: string;

  @ApiProperty({ description: "User's languages", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty({ description: "User's relationship preferences", type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lookingFor?: string[];

  // SETTINGS SECTION
  @ApiProperty({ description: "User's preferences", required: false })
  @IsObject()
  @IsOptional()
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    language?: string;
    timezone?: string;
  };

  @ApiProperty({ description: "User's notification preferences", required: false })
  @IsObject()
  @IsOptional()
  notificationPreferences?: {
    email?: object;
    push?: object;
    sms?: object;
  };

  @ApiProperty({ description: "User's privacy settings", required: false })
  @IsObject()
  @IsOptional()
  privacy?: object;

  @ApiProperty({ description: "User's visibility settings", required: false })
  @IsObject()
  @IsOptional()
  visibility?: object;

  @ApiProperty({ description: 'Deactivate account flag', required: false })
  @IsOptional()
  deactivateAccount?: boolean;
}
