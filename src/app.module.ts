import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from './config/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './modules/shared/shared.module';

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
  ],
})
export class AppModule {
}
