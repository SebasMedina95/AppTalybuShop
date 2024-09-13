import { Body, 
         Controller, 
         Inject, 
         Post } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PRODUCTS_SERVICE } from "../../config/services";
import { CreateSubCategoryDto } from "../../validators/products/sub-categories-dto/create-sub-category.dto";
import { catchError } from "rxjs";


@Controller('subcategories')
export class SubCategoriesController{

    constructor(
        @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
    ) {}

    @Post('/create')
    async createCategory(
        @Body() createSubCategoryDto: CreateSubCategoryDto
    ){
        
        return this.productsClient.send({ cmd: 'create_sub_category' }, createSubCategoryDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

}
