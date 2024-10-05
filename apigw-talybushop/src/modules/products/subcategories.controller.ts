import { Body, 
         Controller, 
         Delete, 
         Get, 
         Inject, 
         Param, 
         Patch, 
         Post } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { NATS_SERVICE } from "../../config/services";
import { CreateSubCategoryDto } from "../../validators/products/sub-categories-dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "../../validators/products/sub-categories-dto/update-sub-category.dto";
import { catchError } from "rxjs";
import { PageOptionsDto } from "src/helpers/paginations/dto/page-options.dto";


@Controller('subcategories')
export class SubCategoriesController{

    constructor(
        @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy,
    ) {}

    @Post('/create')
    async createSubCategory(
        @Body() createSubCategoryDto: CreateSubCategoryDto
    ){
        
        return this.natsClient.send({ cmd: 'create_sub_category' }, createSubCategoryDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

    @Post('/get-paginated')
    async getAllSubCategories(
        @Body() pageOptionsDto: PageOptionsDto
    ){
        //Lo que tenemos dentro del send, el primer argumento es el nombre que le dimos en el @MessagePattern
        //que en este caso fue { cmd: 'get_sub_category_paginated' }, y el segundo es el Payload, es decir, el cuerpo
        //de la petición para enviar los parámetros
        return this.natsClient.send({ cmd: 'get_sub_category_paginated' }, pageOptionsDto )
        .pipe(
            catchError(err => { throw new RpcException(err) })
        )
    }

    @Get('/get-by-id/:id')
    async getSubCategoryById(
        @Param('id') id: number
    ){

        try {

        return this.natsClient.send({ cmd: 'get_sub_category_by_id' }, { 
            id 
        }).pipe(
            catchError(err => { throw new RpcException(err) })
        )

        } catch (error) {

        throw new RpcException(error);

        } 
        
    }

    @Patch('/update/:id')
    async updateSubCategory(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateSubCategoryDto
    ){
        
        return this.natsClient.send({ cmd: 'update_sub_category' }, {
        id,
        ...updateCategoryDto
        }).pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

    @Delete('/delete/:id')
    async deleteSubCategory(
        @Param('id') id: number
    ){
        
        return this.natsClient.send({ cmd: 'delete_logic_sub_category' }, {
        id
        }).pipe(
            catchError(err => { throw new RpcException(err) })
        )
        
    }

}
