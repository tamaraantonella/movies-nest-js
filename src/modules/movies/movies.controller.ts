import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicAccess } from '../auth/decorators/public.decorator';
import { AuthDecorator } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { RolesDecorator } from '../auth/decorators/roles.decorator';
import { MovieDto, MoviesEnvelopeDto } from './dto/movie.dto';

@ApiTags('movies')
@AuthDecorator(Role.ADMIN)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: MovieDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: ['producer: Required'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MoviesEnvelopeDto,
  })
  @PublicAccess()
  @Get()
  findAll(): Promise<MoviesEnvelopeDto> {
    return this.moviesService.findAll();
  }

  @ApiOkResponse({
    type: MovieDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      example: {
        message: 'Movie not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @RolesDecorator(Role.REGULAR)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieDto> {
    const movie = await this.moviesService.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  @ApiOkResponse({
    type: MovieDto,
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      example: {
        message: 'Movie not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const updatedMovie = await this.moviesService.update(id, updateMovieDto);
    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }
    return updatedMovie;
  }

  @ApiOkResponse({
    type: MovieDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      example: {
        message: 'Movie not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const deletedMovie = this.moviesService.remove(id);
    if (!deletedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return deletedMovie;
  }
}
