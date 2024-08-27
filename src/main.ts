import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from './config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API to manage Star Wars movies')
    .setVersion('1.0')
    .addTag('movies')
    .build();
  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const port = configService.get<ConfigProps['port']>('port');
  await app.listen(port).then(() => {
    console.log(`⚡​Listening at http://localhost:${port}/${globalPrefix}`);
  });
}
bootstrap();
