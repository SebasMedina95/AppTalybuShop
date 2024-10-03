import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  
  const logger = new Logger('MicroServicios-CabeceraOrdenes');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.PORT
    }
  });

  await app.listen();
  logger.log(`Microservicio de Cabecera de Ordenes corriendo en puerto: ${envs.PORT}`);
  
}
bootstrap();
