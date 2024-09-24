import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Inject, 
    Param, 
    Patch, 
    Post 
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";

import { PRODUCTS_SERVICE } from "../../config/services";

import { CreateProviderDto } from "../../validators/products/providers-dto/create-provider.dto";
import { UpdateProviderDto } from "../../validators/products/providers-dto/update-provider.dto";

import { PageOptionsDto } from "../../helpers/paginations/dto/page-options.dto";


@Controller('providers')
export class ProvidersController{

    constructor(
        @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
    ) {}

    @Post('/create')
    async createProvider(
        @Body() createProviderDto: CreateProviderDto
    ){
        
        return this.productsClient.send({ cmd: 'create_provider' }, createProviderDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

    @Post('/get-paginated')
    async getAllProviders(
      @Body() pageOptionsDto: PageOptionsDto
    ){
      //Lo que tenemos dentro del send, el primer argumento es el nombre que le dimos en el @MessagePattern
      //que en este caso fue { cmd: 'get_providers_paginated' }, y el segundo es el Payload, es decir, el cuerpo
      //de la petición para enviar los parámetros
      return this.productsClient.send({ cmd: 'get_providers_paginated' }, pageOptionsDto )
        .pipe(
          catchError(err => { throw new RpcException(err) })
        )
    }

    @Get('/get-by-id/:id')
    async getProviderById(
        @Param('id') id: number
    ){

        try {

        return this.productsClient.send({ cmd: 'get_provider_by_id' }, { 
            id 
        }).pipe(
            catchError(err => { throw new RpcException(err) })
        )

        } catch (error) {

        throw new RpcException(error);

        } 
        
    }

    @Patch('/update/:id')
    async updateProvider(
        @Param('id') id: number,
        @Body() updateProviderDto: UpdateProviderDto
    ){
        
        return this.productsClient.send({ cmd: 'update_provider' }, {
        id,
        ...updateProviderDto
        }).pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
        
    }

    @Delete('/delete/:id')
    async deleteProvider(
        @Param('id') id: number
    ){
        
        return this.productsClient.send({ cmd: 'remove_logic_provider' }, {
        id
        }).pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

}
