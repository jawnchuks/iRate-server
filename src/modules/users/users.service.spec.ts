import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../modules/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
            userPhoto: {
              create: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            blockedUser: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
            userReport: {
              create: jest.fn(),
            },
            conversation: {
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
