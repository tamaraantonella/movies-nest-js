import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SwapiMovie, SwapiMoviesResponse } from './types/swapi-movie';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MoviesService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
    private prisma: PrismaService) {
  }

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

  findAll() {
    return this.prisma.movie.findMany();
  }

  findOne(id: number) {
    return this.prisma.movie.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.prisma.movie.update({
      data: updateMovieDto, where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.movie.delete({
      where: { id },
    })
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

  private async syncMoviesWithAPI(movies: SwapiMovie[]) {
    await Promise.all(movies.map(movie => this.syncMovieWithAPI(movie)));
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const swapiUrl = this.configService.get<string>('swapi');
    const { data } = await firstValueFrom(this.http.get<SwapiMoviesResponse>(swapiUrl));
    await this.syncMoviesWithAPI(data.results);
  }
}
