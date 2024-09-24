import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';

import { IProvider } from './interfaces/providers.interface';

@Controller('providers')
export class ProvidersController {

  constructor(private readonly providersService: ProvidersService) {}

  @MessagePattern({ cmd: 'create_provider' })
  async create(
    @Payload() createProviderDto: CreateProviderDto
  ): Promise<ApiTransactionResponse<IProvider | CustomError>> {

    return this.providersService.create(createProviderDto);

  }

  @MessagePattern({ cmd: 'get_providers_paginated' })
  async findAll(
    @Payload() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<IProvider> | Object> {

    return this.providersService.findAll(pageOptionsDto);

  }

  @MessagePattern({ cmd: 'get_provider_by_id' })
  async findOne(
    @Payload('id') id: number
  ): Promise<ApiTransactionResponse<IProvider | string>> {

    return this.providersService.findOne(id);

  }

  @MessagePattern({ cmd: 'update_provider' })
  async update(
    @Payload() updateProviderDto: UpdateProviderDto
  ): Promise<ApiTransactionResponse<IProvider | string>> {

    return this.providersService.update(updateProviderDto.id, updateProviderDto);

  }

  @MessagePattern({ cmd: 'remove_logic_provider' })
  async remove(
    @Payload('id') id: number
  ): Promise<ApiTransactionResponse<IProvider | string>> {

    return this.providersService.remove(id);

  }

}
