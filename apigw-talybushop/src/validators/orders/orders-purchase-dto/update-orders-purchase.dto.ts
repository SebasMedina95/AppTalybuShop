import { PartialType } from '@nestjs/mapped-types';
import { 
  IsEnum, 
  IsNotEmpty, 
  IsNumber, 
  IsPositive 
} from 'class-validator';
import { CreateOrdersPurchaseDto } from './create-orders-purchase.dto';
import { OrderStatus, OrderStatusList } from '../../../constants/OrderEnum';

export class UpdateOrdersPurchaseDto extends PartialType(CreateOrdersPurchaseDto) {

  @IsNumber()
  @IsPositive()
  public id: number;

  @IsEnum(OrderStatusList, { message: `Los estados permitidos son ${OrderStatusList}` })
  @IsNotEmpty()
  status: OrderStatus

}
