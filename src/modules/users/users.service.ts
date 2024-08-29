import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { PrismaService } from '../shared/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const parsed = CreateUserSchema.safeParse(createUserDto);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }
    const hashedPassword = await this.hashPassword(parsed.data.password);
    return this.prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: hashedPassword,
        role: parsed.data.role,
      },
      select: {
        id: true,
        role: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        password: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async validateUserCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
