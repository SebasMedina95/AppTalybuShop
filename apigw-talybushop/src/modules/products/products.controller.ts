import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Inject, 
    Param, 
    Patch, 
    Post, 
    UploadedFiles, 
    UseInterceptors 
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { FilesInterceptor } from "@nestjs/platform-express";
import { catchError } from "rxjs";

import { PRODUCTS_SERVICE } from "../../config/services";

import { CreateProductDto } from "../../validators/products/products-dto/create-product.dto";
import { AddImagesProductDto } from "../../validators/products/products-dto/add-images-product.dto";
import { RemoveImagesProductDto } from "../../validators/products/products-dto/remove-images-product.dto";
import { UpdateProductDto } from "../../validators/products/products-dto/update-product.dto";
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

    return this.productsClient.send({ cmd: 'get_products_paginated' }, pageOptionsDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )

  }

  @Get('/get-by-id/:id')
  async getProductsById(
    @Param('id') id: number
  ){

    try {

      return this.productsClient.send({ cmd: 'get_product_by_id' }, { 
        id 
      }).pipe(
          catchError(err => { throw new RpcException(err) })
        )

    } catch (error) {

      throw new RpcException(error);

    } 
    
  }

  @Post('/add-images')
  @UseInterceptors(FilesInterceptor('imagesProducts', 10))
  async addImagesProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() addImagesProductDto: AddImagesProductDto
  ){

    //* Si viene imágenes, entonces las anexamos al DTO para enviarlas
    if (files){
      addImagesProductDto.imagesProducts = files;
    }

    return this.productsClient.send({ cmd: 'add_images_product' }, 
        addImagesProductDto
      ).pipe(
        catchError(err => { throw new RpcException(err) })
      )
    
  }

  @Post('/remove-images')
  async removeImagesProduct(
    @Body() removeImagesProductDto: RemoveImagesProductDto
  ){

    return this.productsClient.send({ cmd: 'remove_images_product' }, removeImagesProductDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )

  }

  @Patch('/update/:id')
  @UseInterceptors(FilesInterceptor('imagesProducts', 10))
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto
  ){

    return this.productsClient.send({ cmd: 'update_product' }, {
        id,
        ...updateProductDto
      }).pipe(
        catchError(err => { throw new RpcException(err) })
      )

  }

  @Delete('/delete/:id')
  async deleteProvider(
    @Param('id') id: number
  ){
    
    return this.productsClient.send({ cmd: 'remove_logic_product' }, {
      id
    }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
    
  }

}