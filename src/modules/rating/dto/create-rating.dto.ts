import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'The ID of the user being rated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  targetId!: string;

  @ApiProperty({
    description: 'The rating value (1-10)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  score!: number;
}
