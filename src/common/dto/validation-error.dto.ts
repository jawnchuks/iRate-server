import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty({ description: 'Field that failed validation' })
  readonly field: string;

  @ApiProperty({ description: 'Validation error message' })
  readonly message: string;

  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }
}

export class ValidationErrorDto {
  @ApiProperty({ description: 'HTTP status code' })
  readonly statusCode: number;

  @ApiProperty({ description: 'Validation error message' })
  readonly message: string;

  @ApiProperty({ description: 'Validation errors', type: [ValidationError] })
  readonly errors: ValidationError[];

  @ApiProperty({ description: 'Error timestamp' })
  readonly timestamp: string;

  @ApiProperty({ description: 'Error path' })
  readonly path: string;

  constructor(statusCode: number, message: string, errors: ValidationError[], path: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.path = path;
    this.timestamp = new Date().toISOString();
  }
}
