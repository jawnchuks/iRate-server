import { IsEmail, IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterEmailDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "User password (min 8 characters)",
    example: "password123",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password is too weak. It should contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character.",
  })
  password!: string;
}

export class RegisterPhoneDto {
  @ApiProperty({
    description: "Phone number with country code",
    example: "+1234567890",
  })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: "Phone number must be in E.164 format (e.g., +1234567890)",
  })
  phoneNumber!: string;
}

export class RegisterGoogleDto {
  @ApiProperty({
    description: "Google OAuth token",
    example: "ya29.a0AfH6SM...",
  })
  @IsString()
  token!: string;
}
