import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MessageType } from '@prisma/client';

export class CreateMessageDto {
  @IsString()
  content: string = '';

  @IsEnum(MessageType)
  @IsOptional()
  type: MessageType = MessageType.TEXT;
}
