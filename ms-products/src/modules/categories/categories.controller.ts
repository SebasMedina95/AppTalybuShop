import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';

import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern({ cmd: 'create_category' })
  async create(
    @Payload() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoriesService.create(createCategoryDto);
  }

  @MessagePattern({ cmd: 'get_category_paginated' })
  async findAll(
    @Payload() pageOptionsDto: PageOptionsDto
  ) {
    return this.categoriesService.findAll(pageOptionsDto);
  }

  @MessagePattern({ cmd: 'get_category_by_id' })
  async findOne(
    @Payload('id') id: number
  ) {
    return this.categoriesService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update_category' })
  async update(
    @Payload() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(updateCategoryDto.id, updateCategoryDto);
  }

  @MessagePattern({ cmd: 'delete_logic_category' })
  async remove(
    @Payload('id') id: number
  ) {
    return this.categoriesService.remove(+id);
  }
}
