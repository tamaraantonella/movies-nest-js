import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateMovieSchema = extendApi(
  z.object({
    title: z.string().min(1).max(50),
    created: z.coerce.date().describe('The date the movie was created'),
    edited: z.coerce.date().nullish(),
    episodeId: z.number().int(),
    openingCrawl: z.string().min(1).max(500),
    producer: z.string().min(1).max(50),
    url: z.string().url(),
    director: z.string().min(1).max(50),
  }),
);

export class CreateMovieDto extends createZodDto(CreateMovieSchema) {}
