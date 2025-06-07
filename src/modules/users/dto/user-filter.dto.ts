import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Gender } from '@prisma/client';

export class UserFilterDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 50,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by gender',
    enum: Gender,
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: 'Minimum age',
    example: 18,
    required: false,
    minimum: 18,
  })
  @IsInt()
  @Min(18)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minAge?: number;

  @ApiProperty({
    description: 'Maximum age',
    example: 65,
    required: false,
    minimum: 18,
  })
  @IsInt()
  @Min(18)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxAge?: number;

  @ApiProperty({
    description: 'Filter by profession',
    example: 'Software Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  profession?: string;

  @ApiProperty({
    description: 'Minimum rating score',
    example: 4.5,
    required: false,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minRating?: number;

  @ApiProperty({
    description: 'Filter by interest',
    example: 'photography',
    required: false,
  })
  @IsString()
  @IsOptional()
  interest?: string;

  @ApiProperty({
    description: 'Filter by nationality',
    example: 'US',
    required: false,
  })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({
    description: 'Sort field',
    example: 'averageRating',
    required: false,
    enum: ['averageRating', 'totalRatings', 'createdAt', 'lastActive'],
  })
  @IsString()
  @IsOptional()
  sortBy?: 'averageRating' | 'totalRatings' | 'createdAt' | 'lastActive';

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: 'Search query for name or username',
    example: 'john',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
