import { ApiProperty } from '@nestjs/swagger';

export class ProfileRequirementsDto {
  @ApiProperty()
  basicInfo!: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };

  @ApiProperty()
  preferences!: {
    language?: string;
    timezone?: string;
    notifications?: string;
  };

  @ApiProperty()
  privacy!: {
    isProfilePublic?: string;
    areRatingsPublic?: string;
    isLocationPublic?: string;
    isContactPublic?: string;
  };

  @ApiProperty()
  visibility!: {
    isVisibleInSearch?: string;
    isVisibleToNearby?: string;
    isVisibleToRecommended?: string;
  };
}
