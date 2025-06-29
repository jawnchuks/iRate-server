import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    type: 'object',
    additionalProperties: true,
  })
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid input data',
  })
  message: string;

  @ApiProperty({
    description: 'Error details',
    example: ['email must be a valid email address'],
    nullable: true,
  })
  errors?: string[];

  @ApiProperty({
    description: 'Error code',
    example: 'INVALID_INPUT',
    nullable: true,
  })
  errorCode?: string;

  constructor(statusCode: number, message: string, errorCode?: string, errors?: string[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export class ValidationErrorDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Validation errors',
    example: {
      email: ['must be a valid email address'],
      password: ['must be at least 8 characters'],
    },
  })
  validationErrors: Record<string, string[]>;

  constructor(message: string, validationErrors: Record<string, string[]>) {
    super(400, message, 'VALIDATION_ERROR');
    this.validationErrors = validationErrors;
  }
}

export class UnauthorizedErrorDto extends ErrorResponseDto {
  constructor(message: string = 'Unauthorized access') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenErrorDto extends ErrorResponseDto {
  constructor(message: string = 'Access forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundErrorDto extends ErrorResponseDto {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ConflictErrorDto extends ErrorResponseDto {
  constructor(message: string = 'Resource already exists') {
    super(409, message, 'CONFLICT');
  }
}

export class TooManyRequestsErrorDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Retry after seconds',
    example: 60,
  })
  retryAfter: number;

  constructor(message: string = 'Too many requests', retryAfter: number = 60) {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }
}

export class InternalServerErrorDto extends ErrorResponseDto {
  constructor(message: string = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
