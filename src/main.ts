import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin'

import * as morgan from 'morgan';

async function bootstrap() {
  const apiModule = await NestFactory.create(ApiModule);

  // Config
  const configService = apiModule.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';

  apiModule.use(morgan('dev'));

  apiModule.setGlobalPrefix('api');
  apiModule.useGlobalPipes(new ValidationPipe());

  apiModule.enableCors();

  if (NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('An API sandbox for NestJS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(apiModule, config);

    SwaggerModule.setup('api', apiModule, document);
  }

  await apiModule.listen(PORT);

  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
