import { Test, TestingModule } from '@nestjs/testing';
import { OrdersSupplyService } from './orders-supply.service';

describe('OrdersSupplyService', () => {
  let service: OrdersSupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersSupplyService],
    }).compile();

    service = module.get<OrdersSupplyService>(OrdersSupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
