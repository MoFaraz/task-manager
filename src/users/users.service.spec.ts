import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedpassword',
  username: 'testuser',
  role: 'USER',
  createdDate: new Date(),
  lastModifiedDate: new Date(),
} as User;

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findUnique: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              update: jest.fn().mockResolvedValue(mockUser),
              delete: jest.fn().mockResolvedValue(mockUser),
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

  it('should create a user', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'USER'
    };
    expect(await service.createUser(createUserDto)).toEqual(mockUser);
  });

  it('should find a user by username', async () => {
    expect(await service.findByUsername('testuser')).toEqual(mockUser);
  });

  it('should find all users', async () => {
    expect(await service.findAll()).toEqual([mockUser]);
  });

  it('should find a user by ID', async () => {
    expect(await service.findById('1')).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updateUserDto = {
      email: 'updated@example.com',
    };
    //expect(await service.updateUser('1', updateUserDto)).toEqual(mockUser);
  });

  it('should delete a user', async () => {
    expect(await service.deleteUser('1')).toEqual(mockUser);
  });
});
