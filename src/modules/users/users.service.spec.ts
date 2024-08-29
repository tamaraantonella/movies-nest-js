import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SharedModule } from '../shared/shared.module';
import { PrismaService } from '../shared/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let createMock: jest.Mock;
  let findUniqueMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn();
    findUniqueMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: createMock,
              findUnique: findUniqueMock,
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

  describe('create', () => {
    it('should throw an error if email is missing', async () => {
      const createUserDto: CreateUserDto = {
        email: '',
        name: 'Test User',
        password: 'password123',
        role: 'REGULAR',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a user if data is valid', async () => {
      const password = 'strongPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserDto: CreateUserDto = {
        email: 'test@user.com',
        name: 'Test User',
        password: password,
        role: 'REGULAR',
      };
      createMock.mockResolvedValue({ id: 1, role: 'user' });
      // @ts-ignore
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const result = await service.create(createUserDto);
      expect(result).toEqual({ id: 1, role: 'user' });
      expect(createMock).toHaveBeenCalledWith({
        data: {
          email: 'test@user.com',
          name: 'Test User',
          password: hashedPassword,
          role: 'REGULAR',
        },
        select: {
          id: true,
          role: true,
        },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user if it exists', async () => {
      const email = 'test@example.com';
      const user = { id: 1, role: 'REGULAR', password: 'hashedPassword' };

      findUniqueMock.mockResolvedValue(user);
      const result = await service.findByEmail(email);

      expect(result).toEqual(user);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, role: true, password: true },
      });
    });

    it('should return null if does not exists', async () => {
      const email = 'test@example.com';
      await expect(service.findByEmail(email)).resolves.toBeNull();
    });
  });

  describe('validateUserCredentials', () => {
    it('should return a user if it credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 1, role: 'REGULAR', password: 'hashedPassword' };

      findUniqueMock.mockResolvedValue(user);
      // @ts-ignore
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const result = await service.validateUserCredentials(email, password);

      expect(result).toEqual(user);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { email },
        select: { id: true, role: true, password: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should throw an error if user does not exist', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      findUniqueMock.mockResolvedValue(null);

      await expect(
        service.validateUserCredentials(email, password),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
