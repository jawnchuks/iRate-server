import { ValidationError } from 'class-validator';

export function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.reduce((acc: string[], error: ValidationError) => {
    if (error.constraints) {
      acc.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      acc.push(...formatValidationErrors(error.children));
    }
    return acc;
  }, []);
}
