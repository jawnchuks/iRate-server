import { ApiProperty } from '@nestjs/swagger';

export class UserSettingsDto {
  @ApiProperty()
  language!: string;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  notifications!: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  @ApiProperty()
  theme!: 'light' | 'dark';

  @ApiProperty()
  emailNotifications!: boolean;

  @ApiProperty()
  pushNotifications!: boolean;
}
