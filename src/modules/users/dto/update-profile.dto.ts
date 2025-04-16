import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  UserPreferences,
  UserPrivacy,
  UserVisibility,
  UserSettings,
} from '../../../common/types/user.types';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  firstName?: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  dob?: Date;

  @ApiProperty({ required: false, enum: Gender })
  gender?: Gender;

  @ApiProperty({ type: [String], required: false })
  selfDescription?: string[];

  @ApiProperty({ type: [String], required: false })
  valuesInOthers?: string[];

  @ApiProperty({ required: false })
  whoCanSeeRatings?: string;

  @ApiProperty({ required: false })
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };

  @ApiProperty({ required: false })
  preferences?: UserPreferences;

  @ApiProperty({ required: false })
  privacy?: UserPrivacy;

  @ApiProperty({ required: false })
  visibility?: UserVisibility;

  @ApiProperty({ required: false })
  settings?: UserSettings;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ type: [String], required: false })
  interests?: string[];

  @ApiProperty({ required: false })
  location?: {
    latitude: number;
    longitude: number;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  age?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  work?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @IsUrl({}, { each: true })
  photos?: string[];
}
