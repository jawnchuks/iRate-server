import { IsString, Matches, Length, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPhoneDto {
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
  @Length(6, 6, { message: "OTP must be exactly 6 digits" })
  otp!: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Verification code sent to email",
    example: "123456",
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6, { message: "Code must be exactly 6 digits" })
  code!: string;
}
