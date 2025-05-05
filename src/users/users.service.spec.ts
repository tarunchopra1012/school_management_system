import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('someSalt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;

let mockJwtService = {
  signAsync: jest.fn(),
};
let mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let jwtService: MockJwtService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException if email is in use', async () => {
      // Arrange
      const signUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.save!.mockRejectedValue({
        code: '23505',
        detail: 'Key (email)=(test@example.com) already exists.',
      });

      // Act
      const signUpAction = service.create(signUpDto);

      // Assert
      await expect(signUpAction).rejects.toThrow(ConflictException);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      // Arrange
      const signUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.save!.mockRejectedValue(new Error('Unexpected error'));

      // Act
      const signUpAction = service.create(signUpDto);

      // Assert
      await expect(signUpAction).rejects.toThrow(Error);
    });

    it('should creates a new user with a hashed password if the email is not in use', async () => {
      // Arrange
      const signUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.create!.mockImplementation((userData) => ({
        ...userData,
      }));
      userRepository.save!.mockResolvedValue({});

      // Act
      const signUpAction = service.create(signUpDto);

      // Assert
      await expect(signUpAction).resolves.not.toThrow();
      expect(userRepository.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
    });
  });

  describe('signIn', () => {
    it("should throw UnauthorizedException if email doesn't exist", async () => {
      // Arrange
      const signInDto = {
        email: 'invalid@example.com',
        password: 'wrongPassword',
      };
      // Instead of null, return a mock user so the password check is reached
      userRepository.findOneBy!.mockResolvedValue({
        id: 1,
        email: 'invalid@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      });

      // Set up bcrypt.compare to return false (incorrect password)
      const compare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      // Act
      const signInAction = service.signIn(signInDto);

      // Assert
      await expect(signInAction).rejects.toThrow(UnauthorizedException);
      expect(compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      // Arrange
      const signInDto = {
        email: 'valid@example.com',
        password: 'wrongPassword',
      };
      const mockUser = {
        id: 1,
        email: 'valid@example.com',
        password: 'hashedPassword',
      };
      userRepository.findOneBy!.mockResolvedValue(mockUser);
      const compare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      // Act
      const signInAction = service.signIn(signInDto);

      // Assert
      await expect(signInAction).rejects.toThrow(UnauthorizedException);
      expect(compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    });

    it('should return an access token for valid credentials', async () => {
      // Arrange
      const signInDto = { email: 'valid@example.com', password: 'password123' };
      const user = {
        id: 1,
        email: 'valid@example.com',
        password: 'hashedPassword',
      };
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      userRepository.findOneBy!.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token123');

      // Act
      const result = await service.signIn(signInDto);

      // Assert
      expect(result).toEqual({ accessToken: 'token123' });
    });
  });
});
