import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsObject, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: "User's display name" })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({ description: "User's bio or description" })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: "User's interests", type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ description: "User's location" })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: "User's self-description" })
  @IsString()
  @IsOptional()
  selfDescription?: string;

  @ApiProperty({ description: 'Values user looks for in others' })
  @IsString()
  @IsOptional()
  valuesInOthers?: string;

  @ApiProperty({ description: "User's profile picture URL" })
  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;

  @ApiProperty({ description: 'Additional profile photos', type: [String] })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  profilePhotos?: string[];

  @ApiProperty({ description: "User's social media links" })
  @IsObject()
  @IsOptional()
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };

  @ApiProperty({ description: "User's preferences" })
  @IsObject()
  @IsOptional()
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    language?: string;
    timezone?: string;
  };
}
