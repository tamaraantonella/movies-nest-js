import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MovieSchema, MoviesEnvelopeDto } from './dto/movie.dto';
import { PrismaService } from '../shared/prisma.service';
import { SwapiMovie } from '@/modules/swapi/types/swapi-response';

@Injectable()
export class MoviesService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  create(createMovieDto: CreateMovieDto) {
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

  private async syncMovieWithAPI(movie: SwapiMovie) {
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
