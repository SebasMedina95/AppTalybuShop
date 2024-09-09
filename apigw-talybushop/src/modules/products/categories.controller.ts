import { Body, 
         Controller,
         Delete,
         Get,
         Inject,
         Param,
         Patch,
         Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

import { PRODUCTS_SERVICE } from '../../config/services';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { CreateCategoryDto } from '../../validators/products/categories-dto/create-category.dto';
import { UpdateCategoryDto } from '../../validators/products/categories-dto/update-category.dto';
import { Console } from 'console';


@Controller('categories')
export class CategoriesController {

  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post('/create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ){
    
    return this.productsClient.send({ cmd: 'create_category' }, createCategoryDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
    
  }

  @Get('/get-paginated')
  async getAllCategories(
    @Body() pageOptionsDto: PageOptionsDto
  ){
    //Lo que tenemos dentro del send, el primer argumento es el nombre que le dimos en el @MessagePattern
    //que en este caso fue { cmd: 'get_categories_paginated' }, y el segundo es el Payload, es decir, el cuerpo
    //de la petición para enviar los parámetros
    return this.productsClient.send({ cmd: 'get_category_paginated' }, pageOptionsDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @Get('/get-by-id/:id')
  async getCategoryById(
    @Param('id') id: number
  ){

    try {

      return this.productsClient.send({ cmd: 'get_category_by_id' }, { 
        id 
      }).pipe(
          catchError(err => { throw new RpcException(err) })
        )

    } catch (error) {

      throw new RpcException(error);

    } 
    
  }

  @Patch('/update/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ){
    
    return this.productsClient.send({ cmd: 'update_category' }, {
      id,
      ...updateCategoryDto
    }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
    
    
  }

  @Delete('/delete/:id')
  async deleteCategory(
    @Param('id') id: number
  ){
    
    return this.productsClient.send({ cmd: 'delete_logic_category' }, {
      id
    }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
    
  }

}