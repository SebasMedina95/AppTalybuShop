import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/database/prisma.module';

import { OrdersPurchaseService } from './orders-purchase.service';
import { OrdersPurchaseController } from './orders-purchase.controller';

import { OrdersPurchase } from './entities/orders-purchase.entity';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersPurchaseController],
  providers: [OrdersPurchaseService],
  imports: [
    PrismaModule,
    OrdersPurchase,
    NatsModule

  ],
})
export class OrdersPurchaseModule {}
