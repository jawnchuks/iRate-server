import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class LocationDto {
  @ApiProperty({
    description: "Latitude coordinate",
    example: 37.7749,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  latitude!: number;

  @ApiProperty({
    description: "Longitude coordinate",
    example: -122.4194,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  longitude!: number;
}

export class OnboardingDto {
  @ApiProperty({ description: "First name", example: "John" })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: "Last name", example: "Doe" })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: "Date of birth (YYYY-MM-DD)",
    example: "1990-01-01",
  })
  @IsDateString()
  dob!: string;

  @ApiProperty({ description: "Gender", example: "male" })
  @IsString()
  gender!: string;

  @ApiProperty({
    description: "How would you describe yourself? (min 1)",
    example: ["adventurous", "kind"],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  selfDescription!: string[];

  @ApiProperty({
    description: "What do you value in others? (min 1)",
    example: ["honesty", "humor"],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  valuesInOthers!: string[];

  @ApiPropertyOptional({
    description: "Who should see your ratings?",
    example: "everyone",
  })
  @IsOptional()
  @IsString()
  whoCanSeeRatings?: string;

  @ApiProperty({
    description: "Notification preferences",
    example: ["ratings", "profile", "someone"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  notificationPreferences!: string[];

  @ApiProperty({
    description: "Upload up to 4 pictures of yourself",
    example: ["url1", "url2"],
    type: [String],
    maxItems: 4,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  photos!: string[];

  @ApiProperty({
    description: "Profile picture URL (must be one of the uploaded photos)",
    example: "url1",
  })
  @IsString()
  profilePicture!: string;

  @ApiPropertyOptional({
    description: "Profile completion percentage",
    example: 80,
  })
  @IsOptional()
  @IsNumber()
  profileCompletion?: number;

  @ApiProperty({
    description: "User bio (max 500 characters)",
    example: "I love hiking and photography",
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  bio!: string;

  @ApiProperty({
    description: "User interests (min 3)",
    example: ["hiking", "photography", "travel"],
    type: [String],
    minItems: 3,
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(3)
  interests!: string[];

  @ApiPropertyOptional({
    description: "User location coordinates",
    type: LocationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
