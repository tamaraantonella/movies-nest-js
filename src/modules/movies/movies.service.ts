import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMovieDto, CreateMovieSchema } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieSchema, MoviesEnvelopeDto } from './dto/movie.dto';
import { PrismaService } from '../shared/prisma.service';
import { SwapiMovie } from '@/modules/swapi/types/swapi-response';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: {
        url: createMovieDto.url,
      },
    });

    if (existingMovie) {
      throw new BadRequestException('Movie already exists');
    }
    return this.prisma.movie.create({
      data: {
        title: createMovieDto.title,
        episodeId: createMovieDto.episodeId,
        openingCrawl: createMovieDto.openingCrawl,
        director: createMovieDto.director,
        producer: createMovieDto.producer,
        url: createMovieDto.url,
        created: createMovieDto.created,
      },
    });
  }

  async findAll(): Promise<MoviesEnvelopeDto> {
    const movies = await this.prisma.movie.findMany();
    const parsed = MovieSchema.array().parse(movies);
    return { data: parsed, count: parsed.length };
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: {
        id,
      },
    });
    if (!movie) {
      return null;
    }
    return MovieSchema.parse(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existingMovie) {
      return null;
    }
    const updatedMovie = await this.prisma.movie.update({
      data: updateMovieDto,
      where: { id },
    });
    return MovieSchema.parse(updatedMovie);
  }

  async remove(id: number) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!existingMovie) {
      return null;
    }

    const deletedMovie = await this.prisma.movie.delete({
      where: { id },
    });
    return MovieSchema.parse(deletedMovie);
  }

  async syncMovieWithAPI(movie: SwapiMovie) {
    const existingMovie = await this.prisma.movie.findUnique({
      where: {
        url: movie.url,
      },
    });

    if (existingMovie) {
      return;
    }
    await this.prisma.movie.create({
      data: {
        title: movie.title,
        episodeId: movie.episode_id,
        openingCrawl: movie.opening_crawl,
        director: movie.director,
        producer: movie.producer,
        url: movie.url,
        created: movie.created,
      },
    });
  }

  async syncMoviesWithAPI(movies: SwapiMovie[]) {
    await Promise.all(movies.map((movie) => this.syncMovieWithAPI(movie)));
  }
}
