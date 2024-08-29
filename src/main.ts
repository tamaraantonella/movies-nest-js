import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { patchNestjsSwagger, ZodValidationPipe } from '@anatine/zod-nestjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from './config/config.types';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);
  app.use(helmet());
  app.use(morgan('dev'));
  app.useGlobalPipes(new ZodValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API to manage Star Wars movies')
    .setVersion('1.0')
    .addTag('movies')
    .build();
  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const port = configService.get<ConfigProps['port']>('port');
  await app.listen(port).then(() => {
    console.log(`⚡​Listening at PORT /${port}/${globalPrefix}`);
  });
}

bootstrap();
