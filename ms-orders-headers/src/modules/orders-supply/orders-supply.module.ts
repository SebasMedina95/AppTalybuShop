import { Module } from '@nestjs/common';
import { OrdersSupplyService } from './orders-supply.service';
import { OrdersSupplyController } from './orders-supply.controller';

@Module({
  controllers: [OrdersSupplyController],
  providers: [OrdersSupplyService],
})
export class OrdersSupplyModule {}
