import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class ForbiddenErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: 403,
    description: 'HTTP status code',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: 'Forbidden',
    description: 'Error message',
  })
  readonly message: string;

  @ApiProperty({
    example: 'Insufficient permissions to access this resource',
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
    super(403, 'Forbidden', path, details);
    this.statusCode = 403;
    this.message = 'Forbidden';
    this.path = path;
    this.timestamp = new Date().toISOString();
    if (details) {
      this.details = details;
    }
  }
}
