import { ApiProperty } from '@nestjs/swagger';

export class ProfileCompletionDetailsDto {
  @ApiProperty({ description: 'Basic info completion status' })
  basicInfo: {
    firstName: boolean;
    lastName: boolean;
    username: boolean;
    bio: boolean;
  } = {
    firstName: false,
    lastName: false,
    username: false,
    bio: false,
  };

  @ApiProperty({ description: 'Personal details completion status' })
  personalDetails: {
    dateOfBirth: boolean;
    gender: boolean;
    nationality: boolean | null;
    location: boolean;
    interests: boolean;
  } = {
    dateOfBirth: false,
    gender: false,
    nationality: null,
    location: false,
    interests: false,
  };

  @ApiProperty({ description: 'Professional info completion status' })
  professionalInfo: {
    occupation: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
  } = {
    occupation: false,
    education: false,
    skills: false,
    languages: false,
  };

  @ApiProperty({ description: 'Photos completion status' })
  photos: {
    profilePhoto: boolean;
    coverPhoto: boolean;
    gallery: boolean;
  } = {
    profilePhoto: false,
    coverPhoto: false,
    gallery: false,
  };

  @ApiProperty({ description: 'Settings completion status' })
  settings: {
    privacy: boolean;
    notifications: boolean;
    preferences: boolean;
  } = {
    privacy: false,
    notifications: false,
    preferences: false,
  };
}

export class ProfileCompletionDto {
  @ApiProperty({ description: 'Overall completion percentage' })
  completionPercentage: number = 0;

  @ApiProperty({ description: 'Number of completed fields' })
  completedFields: number = 0;

  @ApiProperty({ description: 'Total number of fields' })
  totalFields: number = 0;

  @ApiProperty({ description: 'Detailed completion status', type: ProfileCompletionDetailsDto })
  details: {
    basicInfo: {
      firstName: boolean;
      lastName: boolean;
      username: boolean;
      bio: boolean;
    };
    personalDetails: {
      dateOfBirth: boolean;
      gender: boolean;
      nationality: boolean | null;
      location: boolean;
      interests: boolean;
    };
    professionalInfo: {
      occupation: boolean;
      education: boolean;
      skills: boolean;
      languages: boolean;
    };
    photos: {
      profilePhoto: boolean;
      coverPhoto: boolean;
      gallery: boolean;
    };
    settings: {
      privacy: boolean;
      notifications: boolean;
      preferences: boolean;
    };
  } = {
    basicInfo: {
      firstName: false,
      lastName: false,
      username: false,
      bio: false,
    },
    personalDetails: {
      dateOfBirth: false,
      gender: false,
      nationality: null,
      location: false,
      interests: false,
    },
    professionalInfo: {
      occupation: false,
      education: false,
      skills: false,
      languages: false,
    },
    photos: {
      profilePhoto: false,
      coverPhoto: false,
      gallery: false,
    },
    settings: {
      privacy: false,
      notifications: false,
      preferences: false,
    },
  };
}
