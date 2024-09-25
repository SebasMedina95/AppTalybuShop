import { 
    Body, 
    Controller, 
    Get, 
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
import { PageOptionsDto } from "../../helpers/paginations/dto/page-options.dto";


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

  @Post('/get-paginated')
  async getAllProducts(
    @Body() pageOptionsDto: PageOptionsDto
  ){
    //Lo que tenemos dentro del send, el primer argumento es el nombre que le dimos en el @MessagePattern
    //que en este caso fue { cmd: 'get_products_paginated' }, y el segundo es el Payload, es decir, el cuerpo
    //de la petición para enviar los parámetros
    return this.productsClient.send({ cmd: 'get_products_paginated' }, pageOptionsDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

}