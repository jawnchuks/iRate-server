import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  AFFILIATE = 'AFFILIATE',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// Helper function to check if user has required roles
export const hasRoles = (userRoles: UserRole[], requiredRoles: UserRole[]): boolean => {
  // If user is an affiliate, they can only have that role
  if (userRoles.includes(UserRole.AFFILIATE)) {
    return requiredRoles.includes(UserRole.AFFILIATE);
  }

  // For other roles, check if user has all required roles
  return requiredRoles.every((role) => userRoles.includes(role));
};
