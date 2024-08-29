import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { EnvelopeSchema } from '@/modules/movies/dto/envelope.dto';

export const MovieSchema = extendApi(
  z.object({
    id: z.number().int(),
    title: z.string().min(1).max(50),
    created: z.coerce.date(),
    edited: z.coerce.date().nullable(),
    episodeId: z.number().int(),
    openingCrawl: z.string().min(1),
    producer: z.string().min(1).max(50),
    url: z.string().url(),
    director: z.string().min(1).max(50),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);

export class MovieDto extends createZodDto(MovieSchema) {}

export const MoviesEnvelopeSchema = EnvelopeSchema(MovieSchema.array());

export class MoviesEnvelopeDto extends createZodDto(MoviesEnvelopeSchema) {}
