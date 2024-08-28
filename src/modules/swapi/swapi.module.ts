import { Module } from '@nestjs/common';
import { SwapiService } from './swapi.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [SwapiService],
  exports: [SwapiService],
})
export class SwapiModule {}
