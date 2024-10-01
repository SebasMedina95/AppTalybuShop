import { Injectable } from '@nestjs/common';
import { CreateOrdersPurchaseDto } from './dto/create-orders-purchase.dto';
import { UpdateOrdersPurchaseDto } from './dto/update-orders-purchase.dto';

import { ApiTransactionResponse } from '../../utils/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';
import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';

import { IOrders } from './interfaces/orders.interface';

@Injectable()
export class OrdersPurchaseService {

  async create(
    createOrdersPurchaseDto: CreateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test crear una orden de pago."
    );

  }

  async findAll(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<IOrders> | Object> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test obtener listado de ordenes de pago."
    );

  }

  async findOne(
    id: number
  ): Promise<ApiTransactionResponse<IOrders | string>> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test obtener una orden de pago dado su ID."
    );

  }

  async changedOrderStatus(
    updateOrdersPurchaseDto: UpdateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test actualizar el estado de una orden de pago."
    );

  }

}
