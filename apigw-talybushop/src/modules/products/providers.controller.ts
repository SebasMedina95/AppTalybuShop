import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PRODUCTS_SERVICE } from "../../config/services";
import { CreateProviderDto } from "../../validators/products/providers-dto/create-provider.dto";
import { catchError } from "rxjs";


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

}
