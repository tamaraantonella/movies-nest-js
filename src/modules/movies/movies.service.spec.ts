import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { PrismaService } from '@/modules/shared/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { SharedModule } from '@/modules/shared/shared.module';

describe('MoviesService', () => {
  let service: MoviesService;
  let createMock: jest.Mock;
  let findUniqueMock: jest.Mock;
  let findManyMock: jest.Mock;
  let updateMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn();
    findUniqueMock = jest.fn();
    findManyMock = jest.fn();
    updateMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              create: createMock,
              findUnique: findUniqueMock,
              findMany: findManyMock,
              update: updateMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie if data is valid', async () => {
      const createMovieDto = {
        title: 'Leia',
        created: new Date('2024-12-19T16:52:55.740Z'),
        edited: null,
        episodeId: 8,
        openingCrawl:
          'In a galaxy on the brink of war, Leia must confront her greatest fear to restore peace.',
        producer: 'Tamara',
        url: 'http://localhost/v1/movies/1/',
        director: 'George Lucas',
      };
      findUniqueMock.mockResolvedValue(null);
      createMock.mockResolvedValue(createMovieDto);
      const movie = await service.create(createMovieDto);
      expect(movie).toEqual(createMovieDto);
    });

    it('should throw an error if movie already exists', async () => {
      const createMovieDto = {
        title: 'Leia',
        created: new Date('2024-12-19T16:52:55.740Z'),
        edited: null,
        episodeId: 40,
        openingCrawl:
          'In a galaxy on the brink of war, Leia must confront her greatest fear to restore peace.',
        producer: 'Tamara',
        url: 'http://localhost/v1/movies/1/',
        director: 'George Lucas',
      };

      findUniqueMock.mockResolvedValue(createMovieDto);
      await expect(service.create(createMovieDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all movies', () => {
      const result = {
        data: [
          {
            id: 20,
            title: 'Return of the Jedi',
            created: new Date('2014-12-18T10:39:33.255Z'),
            edited: null,
            episodeId: 6,
            openingCrawl:
              'Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain doom\r\nfor the small band of rebels\r\nstruggling to restore freedom\r\nto the galaxy...',
            producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
            url: 'https://swapi.dev/api/films/3/',
            director: 'Richard Marquand',
            createdAt: new Date('2024-08-28T20:32:48.815Z'),
            updatedAt: new Date('2024-08-28T20:32:48.815Z'),
          },
        ],
        count: 1,
      };
      findManyMock.mockResolvedValue(result.data);
      const movies = service.findAll();
      expect(movies).resolves.toEqual(result);
      expect(findManyMock).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return null if movie does not exists', () => {
      const id = 1;
      findUniqueMock.mockResolvedValue(null);
      const movie = service.findOne(id);
      expect(movie).resolves.toBeNull();
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should return movie if id is valid', async () => {
      const mockMovie = {
        title: 'Return of the Jedi',
        created: new Date('2014-12-18T10:39:33.255Z'),
        edited: null,
        episodeId: 6,
        openingCrawl:
          'Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain doom\r\nfor the small band of rebels\r\nstruggling to restore freedom\r\nto the galaxy...',
        producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
        url: 'https://swapi.dev/api/films/3/',
        director: 'Richard Marquand',
        createdAt: new Date('2024-08-28T20:32:48.815Z'),
        updatedAt: new Date('2024-08-28T20:32:48.815Z'),
        id: 30,
      };
      findUniqueMock.mockResolvedValue(mockMovie);
      const id = 30;
      const result = await service.findOne(id);
      expect(result).toEqual(mockMovie);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('update', () => {
    it('should return null if movie does not exist', async () => {
      const id = 1;
      const updateMovieDto = { title: 'New Title' };

      findUniqueMock.mockResolvedValue(null);

      const result = await service.update(id, updateMovieDto);

      expect(result).toBeNull();
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id },
        select: { id: true },
      });
    });

    it('should update and return the movie if it exists', async () => {
      const id = 1;
      const updateMovieDto = { title: 'New Title' };
      const updatedMovie = {
        title: 'New Title',
        created: new Date('2014-12-18T10:39:33.255Z'),
        edited: null,
        episodeId: 6,
        openingCrawl:
          'Luke Skywalker has returned to\r\nhis home planet of Tatooine in\r\nan attempt to rescue his\r\nfriend Han Solo from the\r\nclutches of the vile gangster\r\nJabba the Hutt.\r\n\r\nLittle does Luke know that the\r\nGALACTIC EMPIRE has secretly\r\nbegun construction on a new\r\narmored space station even\r\nmore powerful than the first\r\ndreaded Death Star.\r\n\r\nWhen completed, this ultimate\r\nweapon will spell certain doom\r\nfor the small band of rebels\r\nstruggling to restore freedom\r\nto the galaxy...',
        producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
        url: 'https://swapi.dev/api/films/3/',
        director: 'Richard Marquand',
        createdAt: new Date('2024-08-28T20:32:48.815Z'),
        updatedAt: new Date('2024-08-28T20:32:48.815Z'),
        id,
      };

      findUniqueMock.mockResolvedValue({ id });
      updateMock.mockResolvedValue(updatedMovie);

      const result = await service.update(id, updateMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id },
        select: { id: true },
      });
      expect(updateMock).toHaveBeenCalledWith({
        data: updateMovieDto,
        where: { id },
      });
    });
  });

  describe('remove', () => {
    it('should return null if movie does not exist', async () => {
      const id = 1;
      findUniqueMock.mockResolvedValue(null);
      const result = await service.remove(id);

      expect(result).toBeNull();
      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('syncMovieWithAPI', () => {
    it('should not create a movie if it already exists', async () => {
      const movie = {
        title: 'Existing Movie',
        episode_id: 4,
        opening_crawl: 'A long time ago in a galaxy far, far away...',
        director: 'George Lucas',
        producer: 'Nick Thomas',
        url: 'https://swapi.dev/api/films/1/',
        created: '1977-05-25T00:00:00.000Z',
        release_date: '1997-05-25',
        edited: null,
      };

      findUniqueMock.mockResolvedValue(movie);

      await service['syncMovieWithAPI'](movie);

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { url: movie.url },
      });
      expect(createMock).not.toHaveBeenCalled();
    });

    it('should create a movie if it does not exist', async () => {
      const movie = {
        title: 'New Movie 2.0',
        episode_id: 5,
        opening_crawl: 'It is a dark time ...',
        director: 'Irina James',
        producer: 'Bob John',
        url: 'https://swapi.dev/api/films/2/',
        created: '1977-05-25T00:00:00.000Z',
        release_date: '1977-05-25',
        edited: null,
      };
      findUniqueMock.mockResolvedValue(null);
      await service.syncMovieWithAPI(movie);

      expect(findUniqueMock).toHaveBeenCalledWith({
        where: { url: movie.url },
      });
      expect(createMock).toHaveBeenCalledWith({
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
    });
  });

  describe('syncMoviesWithAPI', () => {
    it('should sync multiple movies with the API', async () => {
      const movies = [
        {
          title: 'Movie 1',
          episode_id: 1,
          opening_crawl: 'Opening crawl 1...',
          director: 'Director Rob',
          producer: 'Leia Organa',
          url: 'https://swapi.dev/api/films/50/',
          created: '1977-05-25T00:00:00.000Z',
          release_date: '1997-08-25',
          edited: null,
        },
        {
          title: 'Movie 2',
          episode_id: 2,
          opening_crawl: 'Opening crawl 2...',
          director: 'Director 2',
          producer: 'Producer 2',
          url: 'https://swapi.dev/api/films/2/',
          created: '1977-05-25T00:00:00.000Z',
          release_date: '1977-05-25',
          edited: null,
        },
      ];

      jest.spyOn(service, 'syncMovieWithAPI').mockResolvedValue(undefined);

      await service.syncMoviesWithAPI(movies);

      expect(service.syncMovieWithAPI).toHaveBeenCalledTimes(movies.length);
      movies.forEach((movie) => {
        expect(service.syncMovieWithAPI).toHaveBeenCalledWith(movie);
      });
    });
  });
});
