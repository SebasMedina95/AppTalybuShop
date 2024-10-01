import { Test, TestingModule } from '@nestjs/testing';
import { OrdersSupplyController } from './orders-supply.controller';
import { OrdersSupplyService } from './orders-supply.service';

describe('OrdersSupplyController', () => {
  let controller: OrdersSupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersSupplyController],
      providers: [OrdersSupplyService],
    }).compile();

    controller = module.get<OrdersSupplyController>(OrdersSupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
