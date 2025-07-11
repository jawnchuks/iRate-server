import { User } from '@prisma/client';

/**
 * Calculates the profile completion percentage for a user.
 * Only considers relevant profile fields (not system/technical fields).
 */
export function calculateProfileCompletionPercentage(user: Partial<User>): number {
  // List of relevant fields for profile completion
  const fields: (keyof Partial<User>)[] = [
    'firstName',
    'lastName',
    'dob',
    'gender',
    'bio',
    'profilePicture',
    'selfDescription',
    'valuesInOthers',
    'interests',
    'passions',
    'energyEmoji',
    'email',
    'phoneNumber',
    'nationality',
    'religion',
    'ethnicity',
    'zodiacSign',
    'location',
    'school',
    'work',
    'biggestWin',
    'mission',
    'relationshipStatus',
    'vibeCheckAnswers',
    'whoCanSeeRatings',
    'languages', // newly added
    'lookingFor', // newly added
    'height', // newly added
  ];

  let filled = 0;
  let total = fields.length;

  for (const field of fields) {
    const value = user[field];
    if (Array.isArray(value)) {
      if (value.length > 0) filled++;
    } else if (typeof value === 'object' && value !== null) {
      // For JSON fields (location, vibeCheckAnswers)
      if (Object.keys(value).length > 0) filled++;
    } else if (typeof value === 'string') {
      if (value.trim() !== '') filled++;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      if (value !== null && value !== undefined) filled++;
    }
  }

  // Media/photos: count as filled if user has at least 1 media
  if ('media' in user && Array.isArray(user.media) && user.media.length > 0) {
    filled++;
    total++;
  }

  return Math.round((filled / total) * 100);
}
