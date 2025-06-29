import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { NotificationType, Prisma } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: 'The type of notification' })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({ description: 'The title of the notification' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ description: 'The message content of the notification' })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiProperty({ description: 'Additional data for the notification', required: false })
  @IsOptional()
  @IsObject()
  data?: Prisma.JsonValue;
}

export class UpdateNotificationDto {
  @ApiProperty({ description: 'The title of the notification', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The message content of the notification', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'Additional data for the notification', required: false })
  @IsOptional()
  @IsObject()
  data?: Prisma.JsonValue;

  @ApiProperty({ description: 'Whether the notification has been read', required: false })
  @IsOptional()
  read?: boolean;
}
