import { 
    Body, 
    Controller, 
    Inject, 
    Post, 
    UploadedFiles, 
    UseInterceptors 
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { FilesInterceptor } from "@nestjs/platform-express";
import { catchError } from "rxjs";

import { PRODUCTS_SERVICE } from "../../config/services";
import { CreateProductDto } from "../../validators/products/products-dto/create-product.dto";


@Controller('products')
export class ProductsController {

  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('imagesProducts', 10))
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createProductDto: CreateProductDto
  ){

    //* Si viene imágenes, entonces las anexamos al DTO para enviarlas
    if (files){
      createProductDto.imagesProducts = files;
    }

    return this.productsClient.send({ cmd: 'create_product' }, 
        createProductDto
      ).pipe(
        catchError(err => { throw new RpcException(err) })
      )
    
  }

}