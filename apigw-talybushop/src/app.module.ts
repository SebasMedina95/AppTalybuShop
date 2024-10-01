import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { OrdersHeadersModule } from './modules/orders/orders-headers.module';

@Module({
  imports: [
    ProductsModule,
    OrdersHeadersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
