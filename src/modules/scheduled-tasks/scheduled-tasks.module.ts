import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { SwapiModule } from '@/modules/swapi/swapi.module';
import { MoviesModule } from '@/modules/movies/movies.module';

@Module({
  imports: [SwapiModule, MoviesModule],
  providers: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
