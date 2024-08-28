import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponseDto } from '@/modules/auth/dto/auth-response.dto';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register({
    email,
    password,
    ...registerData
  }: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.usersService.create({
      ...registerData,
      email,
      password,
    });

    const payload: IJwtPayload = {
      id: newUser.id,
      email: email,
      role: newUser.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      email: email,
    };
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.usersService.validateUserCredentials(
      email,
      password,
    );
    const payload: IJwtPayload = { id: user.id, email: email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      email: email,
    };
  }
}
