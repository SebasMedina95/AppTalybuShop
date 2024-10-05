import { 
    Body, 
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post 
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '../../config/services';

import { CreateOrdersPurchaseDto } from '../../validators/orders/orders-purchase-dto/create-orders-purchase.dto';
import { UpdateOrdersPurchaseDto } from '../../validators/orders/orders-purchase-dto/update-orders-purchase.dto';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';

@Controller('order-purchase')
export class OrderPurchaseController {

    constructor(
        @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy,
    ) {}

    @Post('/create')
    async createOrderHeader(
        @Body() createOrdersPurchaseDto: CreateOrdersPurchaseDto
    ) {

        return this.natsClient.send({ cmd: 'create_order_purchase_header' }, createOrdersPurchaseDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )

    }

    @Post('/get-paginated')
    async getAllOrderHeader(
        @Body() pageOptionsDto: PageOptionsDto
    ) {
        
        return this.natsClient.send({ cmd: 'get_orders_purchase_headers_paginated' }, pageOptionsDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

    @Get('/get-by-id/:id')
    async getOrderHeaderById(
        @Param('id') id: number
    ) {

        try {

            return this.natsClient.send({ cmd: 'get_order_purchase_header_by_id' }, { 
                id 
            }).pipe(
                catchError(err => { throw new RpcException(err) })
            )

        } catch (error) {

            throw new RpcException(error);

        }
    }

    @Get('/get-by-code/:code')
    async getOrderHeaderByCode(
        @Param('code') code: string
    ) {

        try {

            return this.natsClient.send({ cmd: 'get_order_purchase_header_by_code' }, { 
                code 
            }).pipe(
                catchError(err => { throw new RpcException(err) })
            )

        } catch (error) {

            throw new RpcException(error);

        }
    }

    @Patch('/update-status/:id')
    async changedOrderStatus(
        @Body() updateOrdersPurchaseDto: UpdateOrdersPurchaseDto
    ) {

        return this.natsClient.send({ cmd: 'change_order_purchase_header_status' }, updateOrdersPurchaseDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )

    }

}
