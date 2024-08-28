import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {
  }

  async register({ email, password, ...registerData }: RegisterDto) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.usersService.create({
      ...registerData,
      email,
      password: hashedPassword,
    });

    const payload: IJwtPayload = { id: newUser.id, email: email, role:newUser.role };
    return {
      access_token: this.jwtService.sign(payload),
    };

  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
     throw new BadRequestException('Invalid credentials');
    }
    const payload: IJwtPayload = { id: user.id, email: email, role:user.role  };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
