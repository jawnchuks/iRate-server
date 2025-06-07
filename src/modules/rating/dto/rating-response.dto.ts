import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the rating',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'The ID of the user who gave the rating',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  raterId!: string;

  @ApiProperty({
    description: 'The ID of the user who received the rating',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  rateeId!: string;

  @ApiProperty({
    description: 'The rating score (1-10)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  score!: number;

  @ApiProperty({
    description: 'Optional feedback provided with the rating',
    example: 'Great personality and very engaging',
    required: false,
  })
  feedback?: string;

  @ApiProperty({
    description: 'When the rating was created',
    example: '2024-03-20T12:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the rating was last updated',
    example: '2024-03-20T12:00:00Z',
  })
  updatedAt!: Date;
}

export class RatingStatsDto {
  @ApiProperty({
    description: 'The average rating score',
    example: 7.5,
  })
  averageRating!: number;

  @ApiProperty({
    description: 'The total number of ratings received',
    example: 42,
  })
  totalRatings!: number;

  @ApiProperty({
    description: 'Distribution of ratings from 1 to 10',
    example: {
      1: 2,
      2: 1,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 4,
      10: 2,
    },
  })
  ratingDistribution!: Record<number, number>;

  @ApiProperty({
    description: 'Recent rating trends over time',
    example: [
      {
        date: '2024-03-20T00:00:00Z',
        averageRating: 7.5,
        totalRatings: 42,
      },
    ],
  })
  recentTrends!: Array<{
    date: Date;
    averageRating: number;
    totalRatings: number;
  }>;
}
