import { ApiProperty } from '@nestjs/swagger';

export class ProfileCompletionDto {
  @ApiProperty()
  basicInfo!: number;

  @ApiProperty()
  preferences!: number;

  @ApiProperty()
  privacy!: number;

  @ApiProperty()
  visibility!: number;

  @ApiProperty()
  total!: number;
}
