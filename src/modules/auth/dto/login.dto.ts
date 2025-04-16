import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginEmailDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginPhoneDto {
  @ApiProperty({
    description: "Phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: "Phone number must be in E.164 format (e.g., +1234567890)",
  })
  phoneNumber!: string;

  @ApiProperty({
    description: "OTP code sent to phone number",
    example: "123456",
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp!: string;
}

export class LoginGoogleDto {
  @ApiProperty({
    description: "Google OAuth token",
    example: "ya29.a0AfH6SM...",
  })
  @IsString()
  token!: string;
}
