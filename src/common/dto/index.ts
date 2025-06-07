// Re-export base response types
export { BaseResponseDto } from './base-response.dto';
export { PaginatedResponseDto } from './paginated-response.dto';
export { ApiResponse } from './response.dto';

// Re-export error types with explicit names
export { ErrorResponseDto as BaseErrorResponseDto } from './error-response.dto';
export { ValidationErrorDto as BaseValidationErrorDto } from './validation-error.dto';
export { UnauthorizedErrorDto as BaseUnauthorizedErrorDto } from './unauthorized-error.dto';
export { ForbiddenErrorDto as BaseForbiddenErrorDto } from './forbidden-error.dto';
export { NotFoundErrorDto as BaseNotFoundErrorDto } from './not-found-error.dto';
export { InternalServerErrorDto as BaseInternalServerErrorDto } from './internal-server-error.dto';
