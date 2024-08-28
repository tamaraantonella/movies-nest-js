import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './modules/movies/movies.module';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from './config/config';
import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SwapiModule } from './modules/swapi/swapi.module';
import { ScheduledTasksModule } from '@/modules/scheduled-tasks/scheduled-tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    ScheduleModule.forRoot(),
    MoviesModule,
    AuthModule,
    UsersModule,
    SharedModule,
    ScheduleModule,
    SwapiModule,
    ScheduledTasksModule,
  ],
})
export class AppModule {}
