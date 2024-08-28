import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SwapiMoviesResponse } from './types/swapi-response';

@Injectable()
export class SwapiService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  async getFilms() {
    const swapiUrl = this.configService.get<string>('swapi');
    const { data } = await firstValueFrom(
      this.http.get<SwapiMoviesResponse>(`${swapiUrl}/films`),
    );
    return data.results;
  }
}
