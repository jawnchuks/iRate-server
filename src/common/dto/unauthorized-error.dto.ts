import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class UnauthorizedErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 401,
    description: 'HTTP status code',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Error message',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Invalid or expired token',
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
    super(401, 'Unauthorized', path, details);
    this.statusCode = 401;
    this.message = 'Unauthorized';
    this.path = path;
    this.timestamp = new Date().toISOString();
    if (details) {
      this.details = details;
    }
  }
}
