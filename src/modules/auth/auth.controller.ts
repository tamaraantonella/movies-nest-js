import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from '@/modules/auth/dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: 'User already exists',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOkResponse({
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Invalid email or password',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Post('login')
  login(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto.email, signInDto.password);
  }
}
