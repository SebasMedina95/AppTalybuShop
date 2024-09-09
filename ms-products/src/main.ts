import { NestFactory } from '@nestjs/core';
import { Logger,
         ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions,
         Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.PORT
      }
    }
  );
  const logger = new Logger('MICRO SERVICIO - PRODUCTOS')

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

  await app.listen();
  logger.log(`Microservicio corriendo en puerto: ${envs.PORT}`);

}
bootstrap();
