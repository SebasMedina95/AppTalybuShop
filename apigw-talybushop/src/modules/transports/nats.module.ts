import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS, //Debe ser el mismo que tenemos en el MS de Productos
        options: {
          servers: envs.NATS_SERVERS,
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS, //Debe ser el mismo que tenemos en el MS de Productos
        options: {
          servers: envs.NATS_SERVERS,
        },
      },
    ]),
  ],
})
export class NatsModule {}
