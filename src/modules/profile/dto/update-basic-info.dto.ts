import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class UpdateBasicInfoDto {
  @ApiProperty({ description: "User's first name", required: false })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  firstName?: string;

  @ApiProperty({ description: "User's last name", required: false })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  lastName?: string;

  @ApiProperty({ description: "User's username", required: false })
  @IsString()
  @IsOptional()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  })
  username?: string;

  @ApiProperty({ description: "User's bio", required: false })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  bio?: string;

  @ApiProperty({ description: "User's self description", required: false })
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  selfDescription?: string;

  @ApiProperty({ description: 'What user values in others', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  valuesInOthers?: string;
}
