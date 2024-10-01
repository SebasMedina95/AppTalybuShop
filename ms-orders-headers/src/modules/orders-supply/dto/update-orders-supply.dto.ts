import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersSupplyDto } from './create-orders-supply.dto';

export class UpdateOrdersSupplyDto extends PartialType(CreateOrdersSupplyDto) {
  id: number;
}
