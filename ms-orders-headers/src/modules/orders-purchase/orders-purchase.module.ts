import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/database/prisma.module';

import { OrdersPurchaseService } from './orders-purchase.service';
import { OrdersPurchaseController } from './orders-purchase.controller';

import { OrdersPurchase } from './entities/orders-purchase.entity';

@Module({
  controllers: [OrdersPurchaseController],
  providers: [OrdersPurchaseService],
  imports: [
    PrismaModule,
    OrdersPurchase
  ],
})
export class OrdersPurchaseModule {}
