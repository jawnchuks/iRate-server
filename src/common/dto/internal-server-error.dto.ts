import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class InternalServerErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 500,
    description: 'HTTP status code',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: 'Internal Server Error',
    description: 'Error message',
  })
  readonly message: string;

  @ApiProperty({
    example: 'An unexpected error occurred',
    description: 'Error details',
    required: false,
  })
  readonly details?: string;

  @ApiProperty({
    example: '/api/users',
    description: 'Error path',
  })
  readonly path: string;

  @ApiProperty({
    example: '2024-03-21T12:00:00.000Z',
    description: 'Error timestamp',
  })
  readonly timestamp: string;

  constructor(path: string, details?: string) {
    super(500, 'Internal Server Error', path, details);
    this.statusCode = 500;
    this.message = 'Internal Server Error';
    this.path = path;
    this.timestamp = new Date().toISOString();
    if (details) {
      this.details = details;
    }
  }
}
