import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

import { envs } from './config/envs';
import { swaggerAuth } from './middleware/swagger-auth.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: envs.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, x-api-key',
  });

  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas
      transform: true, // Transforma las entradas al tipo definido en el DTO
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos
      },
    })
  );

  // Swagger setup
  app.use('/api/docs', swaggerAuth(envs.SWAGGER_USER, envs.SWAGGER_PASSWORD));

  const config = new DocumentBuilder()
    .setTitle('API Gateway - Asoganan Inversiones')
    .setDescription('API Gateway para el sistema de gestión de inversiones de Asoganan.')
    .setVersion('0.0.1')
    .addTag('API Gateway')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  await app.listen(envs.PORT);
  logger.log(`API Lyrion corriendo en ${envs.HOST}:${envs.PORT}`);
}
void bootstrap();
