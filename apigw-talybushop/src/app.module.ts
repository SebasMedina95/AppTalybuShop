import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { OrdersHeadersModule } from './modules/orders/orders-headers.module';
import { NatsModule } from './modules/transports/nats.module';

@Module({
  imports: [
    ProductsModule,
    OrdersHeadersModule,
    NatsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
