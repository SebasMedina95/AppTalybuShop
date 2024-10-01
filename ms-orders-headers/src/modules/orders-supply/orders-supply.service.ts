import { Injectable } from '@nestjs/common';
import { CreateOrdersSupplyDto } from './dto/create-orders-supply.dto';
import { UpdateOrdersSupplyDto } from './dto/update-orders-supply.dto';

@Injectable()
export class OrdersSupplyService {
  create(createOrdersSupplyDto: CreateOrdersSupplyDto) {
    return 'This action adds a new ordersSupply';
  }

  findAll() {
    return `This action returns all ordersSupply`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersSupply`;
  }

  update(id: number, updateOrdersSupplyDto: UpdateOrdersSupplyDto) {
    return `This action updates a #${id} ordersSupply`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordersSupply`;
  }
}
