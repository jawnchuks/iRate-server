import { Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseResponseDto } from '../dto/base-response.dto';

export abstract class BaseController<T, CreateDto, UpdateDto> {
  constructor(protected readonly service: BaseService<T, CreateDto, UpdateDto>) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<T | null>> {
    const data = await this.service.findOne(id);
    return new BaseResponseDto(
      HttpStatus.OK,
      data ? 'Resource found successfully' : 'Resource not found',
      data,
    );
  }

  @Get()
  async findAll(@Query() query: Record<string, unknown>): Promise<BaseResponseDto<T[]>> {
    const data = await this.service.findAll(query);
    return new BaseResponseDto(HttpStatus.OK, 'Resources retrieved successfully', data);
  }

  @Post()
  async create(@Body() createDto: CreateDto): Promise<BaseResponseDto<T>> {
    const data = await this.service.create(createDto);
    return new BaseResponseDto(HttpStatus.CREATED, 'Resource created successfully', data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto): Promise<BaseResponseDto<T>> {
    const data = await this.service.update(id, updateDto);
    return new BaseResponseDto(HttpStatus.OK, 'Resource updated successfully', data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponseDto<T>> {
    const data = await this.service.delete(id);
    return new BaseResponseDto(HttpStatus.OK, 'Resource deleted successfully', data);
  }
}
