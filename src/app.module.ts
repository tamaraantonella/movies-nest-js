import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [],
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    UsersModule,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
