import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateInterestsPreferencesDto {
  @ApiProperty({
    description: "User's interests and hobbies",
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({
    description: 'Languages the user speaks',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty({
    description: "User's preferences for matches",
    required: false,
  })
  @IsObject()
  @IsOptional()
  matchPreferences?: {
    ageRange?: {
      min?: number;
      max?: number;
    };
    distance?: number;
    gender?: string[];
    interests?: string[];
  };

  @ApiProperty({
    description: "User's vibe check answers",
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  vibeCheck?: string[];
}
