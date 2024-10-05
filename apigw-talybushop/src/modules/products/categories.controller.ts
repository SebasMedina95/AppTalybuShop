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

import { NATS_SERVICE } from '../../config/services';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { CreateCategoryDto } from '../../validators/products/categories-dto/create-category.dto';
import { UpdateCategoryDto } from '../../validators/products/categories-dto/update-category.dto';


@Controller('categories')
export class CategoriesController {

  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy,
  ) {}

  @Post('/create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ){
    
    return this.natsClient.send({ cmd: 'create_category' }, createCategoryDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
    
  }

  @Post('/get-paginated')
  async getAllCategories(
    @Body() pageOptionsDto: PageOptionsDto
  ){

    return this.natsClient.send({ cmd: 'get_category_paginated' }, pageOptionsDto )
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
      
  }

  @Get('/get-by-id/:id')
  async getCategoryById(
    @Param('id') id: number
  ){

    try {

      return this.natsClient.send({ cmd: 'get_category_by_id' }, { 
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
    
    return this.natsClient.send({ cmd: 'update_category' }, {
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
    
    return this.natsClient.send({ cmd: 'delete_logic_category' }, {
      id
    }).pipe(
      catchError(err => { throw new RpcException(err) })
    )
    
  }

  @Get('/get-subcategories-by-id/:id')
  async get_sub_categories_by_category(
    @Param('id') id: number
  ){

    try {

      return this.natsClient.send({ cmd: 'get_sub_categories_by_category' }, { 
        id 
      }).pipe(
          catchError(err => { throw new RpcException(err) })
        )

    } catch (error) {

      throw new RpcException(error);

    } 
    
  }

}