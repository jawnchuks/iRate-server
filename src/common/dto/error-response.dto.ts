import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code' })
  readonly statusCode: number;

  @ApiProperty({ description: 'Error message' })
  readonly message: string;

  @ApiProperty({ description: 'Error details', required: false })
  readonly details?: string;

  @ApiProperty({ description: 'Error timestamp' })
  readonly timestamp: string;

  @ApiProperty({ description: 'Error path' })
  readonly path: string;

  constructor(statusCode: number, message: string, path: string, details?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.path = path;
    this.timestamp = new Date().toISOString();
    if (details) {
      this.details = details;
    }
  }
}
