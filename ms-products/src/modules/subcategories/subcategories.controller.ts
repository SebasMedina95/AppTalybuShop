import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PageOptionsDto } from 'src/helpers/paginations/dto/page-options.dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @MessagePattern({ cmd: 'create_sub_category' })
  async create(
    @Payload() createSubCategoryDto: CreateSubcategoryDto
  ) {
    return this.subcategoriesService.create(createSubCategoryDto);
  }

  @MessagePattern({ cmd: 'get_sub_category_paginated' })
  async findAll(
    @Payload() pageOptionsDto: PageOptionsDto
  ) {
    return this.subcategoriesService.findAll(pageOptionsDto);
  }

  @MessagePattern({ cmd: 'get_sub_category_by_id' })
  async findOne(
    @Payload('id') id: number
  ) {
    return this.subcategoriesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_sub_category' })
  async update(
    @Payload() updateSubCategoryDto: UpdateSubcategoryDto
  ) {
    return this.subcategoriesService.update(updateSubCategoryDto.id, updateSubCategoryDto);
  }

  @MessagePattern({ cmd: 'delete_logic_sub_category' })
  async remove(
    @Payload('id') id: number
  ) {
    return this.subcategoriesService.remove(id);
  }
}
