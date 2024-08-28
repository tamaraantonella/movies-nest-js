import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SwapiService } from '@/modules/swapi/swapi.service';
import { MoviesService } from '@/modules/movies/movies.service';

@Injectable()
export class ScheduledTasksService {
  constructor(
    private swapiService: SwapiService,
    private moviesService: MoviesService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncSwapiMovies() {
    const moviesFromSwapi = await this.swapiService.getFilms();
    await this.moviesService.syncMoviesWithAPI(moviesFromSwapi);
  }
}
