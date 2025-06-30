import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  BaseResponseDto,
  BaseValidationErrorDto as ValidationErrorDto,
  BaseUnauthorizedErrorDto as UnauthorizedErrorDto,
  BaseForbiddenErrorDto as ForbiddenErrorDto,
  BaseNotFoundErrorDto as NotFoundErrorDto,
  BaseInternalServerErrorDto as InternalServerErrorDto,
} from '../../../common/dto';
import { CreateMessageDto, CreateChatRequestDto, PaginationDto } from '../dto/chat.dto';
import { Message } from '../entities/message.entity';
import { Chat } from '../entities/chat.entity';
import { ChatRequest } from '../entities/chat-request.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../../common/utils/cloudinary';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({
    status: 201,
    description: 'Chat created successfully',
    type: () => BaseResponseDto<ChatRequest>,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: ValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async createChat(
    @CurrentUser('sub') userId: string,
    @Body('participantId') participantId: string,
  ): Promise<BaseResponseDto<ChatRequest>> {
    const chat = await this.chatService.createChatRequest(userId, participantId);
    return new BaseResponseDto<ChatRequest>(
      HttpStatus.CREATED,
      'Chat request created successfully',
      chat,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all chats',
    type: () => BaseResponseDto<Chat[]>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async getChats(@CurrentUser('sub') userId: string): Promise<BaseResponseDto<Chat[]>> {
    const chats = await this.chatService.getConversations(userId);
    return new BaseResponseDto<Chat[]>(HttpStatus.OK, 'Chats retrieved successfully', chats);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chat by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the chat',
    type: () => BaseResponseDto<Chat>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Chat not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async getChat(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<BaseResponseDto<Chat>> {
    const chat = await this.chatService.getConversation(id, userId);
    return new BaseResponseDto<Chat>(HttpStatus.OK, 'Chat retrieved successfully', chat);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages for a chat' })
  @ApiResponse({
    status: 200,
    description: 'Returns chat messages',
    type: () => BaseResponseDto<Message[]>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Chat not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async getMessages(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<BaseResponseDto<Message[]>> {
    const messages = await this.chatService.getMessages(id, userId, page, limit);
    return new BaseResponseDto<Message[]>(
      HttpStatus.OK,
      'Messages retrieved successfully',
      messages,
    );
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a chat' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: () => BaseResponseDto<Message>,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: ValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Chat not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<BaseResponseDto<Message>> {
    const message = await this.chatService.sendMessage(id, userId, createMessageDto);
    return new BaseResponseDto<Message>(HttpStatus.CREATED, 'Message sent successfully', message);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat' })
  @ApiResponse({
    status: 200,
    description: 'Chat deleted successfully',
    type: () => BaseResponseDto<void>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Chat not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async deleteChat(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.chatService.deleteConversation(id, userId);
    return new BaseResponseDto<void>(HttpStatus.OK, 'Chat deleted successfully', undefined);
  }

  @Delete(':id/messages/:messageId')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
    type: () => BaseResponseDto<void>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Message not found', type: NotFoundErrorDto })
  @ApiResponse({ status: 500, description: 'Internal server error', type: InternalServerErrorDto })
  async deleteMessage(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.chatService.deleteMessage(id, messageId, userId);
    return new BaseResponseDto<void>(HttpStatus.OK, 'Message deleted successfully', undefined);
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload media (image, video, etc.) for chat messages' })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
    schema: {
      properties: {
        url: { type: 'string', example: 'https://res.cloudinary.com/.../media.jpg' },
        publicId: { type: 'string', example: 'iRate/users/123/media/abc123' },
        viewOnce: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or upload failed',
    type: ValidationErrorDto,
  })
  async uploadMedia(
    @CurrentUser('sub') userId: string,
    @Body('viewOnce') viewOnce: boolean,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        viewOnce: !!viewOnce,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      return { error: message };
    }
  }
}

@ApiTags('chat-requests')
@Controller('chat-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatRequestController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({
    summary: 'Get chat requests',
    description: 'Retrieve all pending chat requests for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat requests retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async getChatRequests(@CurrentUser('sub') userId: string, @Query() pagination: PaginationDto) {
    const requests = await this.chatService.getChatRequests(
      userId,
      pagination.page,
      pagination.limit,
    );
    return new BaseResponseDto(HttpStatus.OK, 'Chat requests retrieved successfully', requests);
  }

  @Post()
  @ApiOperation({
    summary: 'Create chat request',
    description: 'Create a new chat request to start a conversation',
  })
  @ApiResponse({
    status: 201,
    description: 'Chat request created successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    type: ValidationErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Chat request already exists',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async createChatRequest(@CurrentUser('sub') userId: string, @Body() dto: CreateChatRequestDto) {
    const request = await this.chatService.createChatRequest(userId, dto.targetUserId);
    return new BaseResponseDto(HttpStatus.CREATED, 'Chat request created successfully', request);
  }

  @Post(':requestId/accept')
  @ApiOperation({
    summary: 'Accept chat request',
    description: 'Accept a pending chat request and create a conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat request accepted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User not authorized to accept this request',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat request not found',
    type: NotFoundErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async acceptChatRequest(
    @Param('requestId') requestId: string,
    @CurrentUser('sub') userId: string,
  ) {
    const conversation = await this.chatService.acceptChatRequest(requestId, userId);
    return new BaseResponseDto(HttpStatus.OK, 'Chat request accepted successfully', conversation);
  }

  @Post(':requestId/decline')
  @ApiOperation({
    summary: 'Decline chat request',
    description: 'Decline a pending chat request',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat request declined successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User not authorized to decline this request',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat request not found',
    type: NotFoundErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async declineChatRequest(
    @Param('requestId') requestId: string,
    @CurrentUser('sub') userId: string,
  ) {
    const request = await this.chatService.declineChatRequest(requestId, userId);
    return new BaseResponseDto(HttpStatus.OK, 'Chat request declined successfully', request);
  }
}
