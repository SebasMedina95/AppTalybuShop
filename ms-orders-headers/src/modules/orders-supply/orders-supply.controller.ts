import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersSupplyService } from './orders-supply.service';
import { CreateOrdersSupplyDto } from './dto/create-orders-supply.dto';
import { UpdateOrdersSupplyDto } from './dto/update-orders-supply.dto';

@Controller()
export class OrdersSupplyController {
  constructor(private readonly ordersSupplyService: OrdersSupplyService) {}

  @MessagePattern('createOrdersSupply')
  create(@Payload() createOrdersSupplyDto: CreateOrdersSupplyDto) {
    return this.ordersSupplyService.create(createOrdersSupplyDto);
  }

  @MessagePattern('findAllOrdersSupply')
  findAll() {
    return this.ordersSupplyService.findAll();
  }

  @MessagePattern('findOneOrdersSupply')
  findOne(@Payload() id: number) {
    return this.ordersSupplyService.findOne(id);
  }

  @MessagePattern('updateOrdersSupply')
  update(@Payload() updateOrdersSupplyDto: UpdateOrdersSupplyDto) {
    return this.ordersSupplyService.update(updateOrdersSupplyDto.id, updateOrdersSupplyDto);
  }

  @MessagePattern('removeOrdersSupply')
  remove(@Payload() id: number) {
    return this.ordersSupplyService.remove(id);
  }
}
