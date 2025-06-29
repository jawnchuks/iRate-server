import { PrismaService } from '../../modules/prisma/prisma.service';
import { RedisService } from '../../modules/redis/redis.service';
import { Prisma } from '@prisma/client';

type PrismaModel<T> = {
  findUnique: (args: { where: { id: string } }) => Promise<T | null>;
  findMany: (args?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) => Promise<T[]>;
  create: (args: { data: Prisma.UserCreateInput }) => Promise<T>;
  update: (args: { where: { id: string }; data: Prisma.UserUpdateInput }) => Promise<T>;
  delete: (args: { where: { id: string } }) => Promise<T>;
};

type PrismaClientWithModels<T = unknown> = {
  [key: string]: PrismaModel<T>;
};

export abstract class BaseService<T, CreateDto, UpdateDto> {
  protected abstract readonly model: Prisma.ModelName;
  protected abstract readonly cacheKey: string;
  protected readonly cacheTTL = 300; // 5 minutes

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly redis: RedisService,
  ) {}

  protected async getCached<R>(key: string): Promise<R | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  protected async setCache(key: string, data: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(data));
  }

  protected async invalidateCache(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async findOne(id: string): Promise<T | null> {
    const cacheKey = `${this.cacheKey}:${id}`;
    const cached = await this.getCached<T>(cacheKey);
    if (cached) return cached;

    const result = await (
      (this.prisma as unknown as PrismaClientWithModels<T>)[
        this.model.toLowerCase()
      ] as PrismaModel<T>
    ).findUnique({
      where: { id },
    });

    if (result) {
      await this.setCache(cacheKey, result);
    }

    return result;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<T[]> {
    return (
      (this.prisma as unknown as PrismaClientWithModels<T>)[
        this.model.toLowerCase()
      ] as PrismaModel<T>
    ).findMany(params);
  }

  async create(data: CreateDto): Promise<T> {
    const result = await (
      (this.prisma as unknown as PrismaClientWithModels<T>)[
        this.model.toLowerCase()
      ] as PrismaModel<T>
    ).create({
      data: data as Prisma.UserCreateInput,
    });
    await this.invalidateCache(this.cacheKey);
    return result;
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    const result = await (
      (this.prisma as unknown as PrismaClientWithModels<T>)[
        this.model.toLowerCase()
      ] as PrismaModel<T>
    ).update({
      where: { id },
      data: data as Prisma.UserUpdateInput,
    });
    await this.invalidateCache(`${this.cacheKey}:${id}`);
    await this.invalidateCache(this.cacheKey);
    return result;
  }

  async delete(id: string): Promise<T> {
    const result = await (
      (this.prisma as unknown as PrismaClientWithModels<T>)[
        this.model.toLowerCase()
      ] as PrismaModel<T>
    ).delete({
      where: { id },
    });
    await this.invalidateCache(`${this.cacheKey}:${id}`);
    await this.invalidateCache(this.cacheKey);
    return result;
  }
}
