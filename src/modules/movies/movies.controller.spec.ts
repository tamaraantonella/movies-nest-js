import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  let createMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController, JwtModule],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            create: createMock,
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
        {
          provide: AuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /movies', () => {
    it('should create a movie if data is valid', async () => {
      const createMovieDto = {
        title: 'Black swan',
        producer: 'Natalie Portman',
        director: 'Darren Warren',
        episodeId: 1,
        openingCrawl: 'Such a wondeful swan ...',
        url: 'https://blackswan.dev/api/films/1/',
      };
      const createdMovie = { ...createMovieDto, id: 1 };
      createMock.mockResolvedValue(createdMovie);

      const result = await controller.create(createMovieDto);

      expect(result).toEqual(createdMovie);
      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
    });

    it('should throw a BadRequestException if data is invalid', async () => {
      const createMovieDto = {
        title: 'Black swan',
        director: 'Darren Warren',
        episodeId: 1,
        openingCrawl: 'Opening crawl text...',
        url: 'https://swapi.dev/api/films/1/',
      };

      jest
        .spyOn(moviesService, 'create')
        .mockRejectedValue(new BadRequestException('producer: Required'));

      await expect(controller.create(createMovieDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('GET /movies', () => {
    it('should return all movies', () => {
      const result = {
        data: [
          {
            id: 10,
            title: 'Return of the Jedi',
            created: new Date('2014-12-18T10:39:33.255Z'),
            edited: null,
            episodeId: 6,
            openingCrawl:
              'Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has...',
            producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
            url: 'https://swapi.dev/api/films/3/',
            director: 'Richard Marquand',
            createdAt: new Date('2024-08-28T20:32:48.815Z'),
            updatedAt: new Date('2024-08-28T20:32:48.815Z'),
          },
        ],
        count: 1,
      };
      jest.spyOn(moviesService, 'findAll').mockResolvedValue(result);
      expect(controller.findAll()).resolves.toEqual(result);
    });
  });

  describe('GET /movies/:id', () => {
    it('should return a movie by id', async () => {
      const movie = {
        id: 1,
        title: 'Black swan',
        producer: 'Natalie Portman',
        director: 'Darren Warren',
        episodeId: 1,
        openingCrawl: 'Such a wondeful swan ...',
        url: 'https://blackswan.dev/api/films/1/',
      };
      const id = 1;
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(movie);

      const result = await controller.findOne(id);

      expect(result).toEqual(movie);
      expect(moviesService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw 404 error if movie id does not exists', () => {
      const id = 1;
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(null);

      expect(controller.findOne(id)).rejects.toThrow(
        new BadRequestException('Movie not found'),
      );
      expect(moviesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('PATCH /movies/:id', () => {
    const movieToUpdate = {
      title: 'White swan',
    };
    const movie = {
      id: 1,
      title: 'White swan',
      producer: 'Natalie Portman',
      director: 'Darren Warren',
      episodeId: 1,
      openingCrawl: 'Such a wondeful swan ...',
      url: 'https://blackswan.dev/api/films/1/',
    };
    const id = 1;

    it('should update a movie by id', async () => {
      jest.spyOn(moviesService, 'update').mockResolvedValue(movie);

      const result = await controller.update(id, movieToUpdate);

      expect(result).toEqual(movie);
      expect(moviesService.update).toHaveBeenCalledWith(id, movieToUpdate);
    });

    it('should throw 404 error if movie id does not exists', () => {
      const id = 1;
      jest.spyOn(moviesService, 'update').mockResolvedValue(null);

      expect(controller.findOne(id)).rejects.toThrow(
        new BadRequestException('Movie not found'),
      );
      expect(moviesService.findOne).toHaveBeenCalledWith(id);
    });
  });
});
