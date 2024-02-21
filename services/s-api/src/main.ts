import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: '*',
    origin: 'http://localhost:8080',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use(helmet());
  await app.listen(8001);
}
bootstrap();
