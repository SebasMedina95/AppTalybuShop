import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersPurchaseModule } from './modules/orders-purchase/orders-purchase.module';
import { OrdersSupplyModule } from './modules/orders-supply/orders-supply.module';

@Module({
  imports: [

    //? Configuración Global
    ConfigModule.forRoot({ isGlobal: true }),

    OrdersPurchaseModule,
    OrdersSupplyModule],

  controllers: [],
  providers: [],
})
export class AppModule {}
