import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './helpers/errors/rpc-custom-exception.filter';
import { envs } from './config/envs';

async function bootstrap() {
  
  const logger = new Logger("Main - Gateway");
  const app = await NestFactory.create(AppModule);

  //? Prefijo Globlal
  app.setGlobalPrefix('api');

  //? Configuración global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  //? Excepciones globales
  app.useGlobalFilters(new RpcCustomExceptionFilter())

  await app.listen(envs.PORT);
  logger.log(`El Gateway esta corriendo en el puerto ${envs.PORT}`);
  
}
bootstrap();
