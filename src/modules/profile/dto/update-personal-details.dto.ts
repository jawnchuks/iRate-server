import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDate, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class UpdatePersonalDetailsDto {
  @ApiProperty({
    description: "User's gender",
    enum: Gender,
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: "User's date of birth",
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dob?: Date;

  @ApiProperty({
    description: "User's nationality",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  nationality?: string;

  @ApiProperty({
    description: "User's zodiac sign",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 20)
  zodiacSign?: string;

  @ApiProperty({
    description: "User's relationship status",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  relationshipStatus?: string;

  @ApiProperty({
    description: 'What the user is looking for',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  lookingFor?: string;
}
