import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from './config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const configService = app.get(ConfigService);
  const globalPrefix = 'v1';
  const port = configService.get<ConfigProps['port']>('port');
  await app.listen(port).then(() => {
    console.log(`⚡​Listening at http://localhost:${port}/${globalPrefix}`);
  });
}
bootstrap();
