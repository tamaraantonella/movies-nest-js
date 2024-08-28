import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags } from '@nestjs/swagger';
import { PublicAccess } from '../auth/decorators/public.decorator';
import { AuthDecorator } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { RolesDecorator } from '../auth/decorators/roles.decorator';

@ApiTags('movies')
@AuthDecorator(Role.ADMIN)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @PublicAccess()
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @RolesDecorator(Role.REGULAR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
