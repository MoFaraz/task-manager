import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedpassword',
  username: 'testuser',
  role: 'USER',
  createdDate: new Date(),
  lastModifiedDate: new Date(),
} as User;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findByUsername: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup a user', async () => {
    const signupDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    };

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

    expect(await service.signup(signupDto)).toEqual({ access_token: 'token' });
  });

  it('should signin a user', async () => {
    const signinDto = {
      username: 'testuser',
      password: 'password123',
    };

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    expect(await service.signin(signinDto)).toEqual({ access_token: 'token' });
  });

  it('should throw an error if signin credentials are invalid', async () => {
    const signinDto = {
      username: 'testuser',
      password: 'wrongpassword',
    };

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.signin(signinDto)).rejects.toThrow();
  });
});
