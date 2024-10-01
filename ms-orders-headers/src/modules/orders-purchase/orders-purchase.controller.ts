import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersPurchaseService } from './orders-purchase.service';
import { CreateOrdersPurchaseDto } from './dto/create-orders-purchase.dto';
import { UpdateOrdersPurchaseDto } from './dto/update-orders-purchase.dto';

import { ApiTransactionResponse } from '../../utils/ApiResponse';
import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';

import { IOrders } from './interfaces/orders.interface';

@Controller()
export class OrdersPurchaseController {
  constructor(private readonly ordersPurchaseService: OrdersPurchaseService) {}

  @MessagePattern({ cmd: 'create_order_purchase_header'})
  async create(
    @Payload() createOrdersPurchaseDto: CreateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    return this.ordersPurchaseService.create(createOrdersPurchaseDto);

  }

  @MessagePattern({ cmd: 'get_orders_purchase_headers_paginated'})
  async findAll(
    @Payload() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<IOrders> | Object> {

    return this.ordersPurchaseService.findAll(pageOptionsDto);

  }

  @MessagePattern({ cmd: 'get_order_purchase_header_by_id' })
  async findOne(
    @Payload('id') id: number
  ): Promise<ApiTransactionResponse<IOrders | string>> {

    return this.ordersPurchaseService.findOne(id);

  }

  @MessagePattern({ cmd: 'get_order_purchase_header_by_code' })
  async findOneByCode(
    @Payload('code') code: string
  ): Promise<ApiTransactionResponse<IOrders | string>> {

    return this.ordersPurchaseService.findOneByCode(code);

  }

  @MessagePattern({ cmd: 'change_order_purchase_header_status' })
  async changedOrderStatus(
    @Payload() updateOrdersPurchaseDto: UpdateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    return this.ordersPurchaseService.changedOrderStatus(updateOrdersPurchaseDto);
    
  }

}
