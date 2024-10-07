import { Module } from '@nestjs/common';
import { OrderPurchaseController } from './order-purchase.controller';
import { NatsModule } from '../transports/nats.module';


@Module({
  controllers: [
    OrderPurchaseController,
  ],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class OrdersHeadersModule {}
