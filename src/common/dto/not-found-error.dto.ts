import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class NotFoundErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 404,
    description: 'HTTP status code',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: 'Not Found',
    description: 'Error message',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Resource not found',
    description: 'Error details',
    required: false,
  })
  readonly details?: string;

  @ApiProperty({
    example: '/api/users/123',
    description: 'Error path',
  })
  readonly path: string;

  @ApiProperty({
    example: '2024-03-21T12:00:00.000Z',
    description: 'Error timestamp',
  })
  readonly timestamp: string;

  constructor(path: string, details?: string) {
    super(404, 'Not Found', path, details);
    this.statusCode = 404;
    this.message = 'Not Found';
    this.path = path;
    this.timestamp = new Date().toISOString();
    if (details) {
      this.details = details;
    }
  }
}
