import { IsOptional, IsArray, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsEnum(Gender)
  preferredGender?: Gender;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  maxAge?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxDistance?: number;
}
