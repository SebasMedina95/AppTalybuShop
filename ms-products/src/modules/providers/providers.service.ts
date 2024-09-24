import { Injectable, Logger } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

import { IProvider } from './interfaces/providers.interface';
import { PrismaService } from '../../config/database/prisma.service';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';

import { CustomError } from '../../helpers/errors/custom.error';
import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';

@Injectable()
export class ProvidersService {

  private readonly logger = new Logger('ProvidersService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  constructor(
    private prisma: PrismaService
  ){}

  async create(createProviderDto: CreateProviderDto): Promise<ApiTransactionResponse<IProvider | CustomError>> {
    
    try {
      
      const newProvider = await this.prisma.tBL_PROVIDERS.create({
        data: {
          name: createProviderDto.name,
          address: createProviderDto.address,
          phone1: createProviderDto.phone1.toString(),
          phone2: (createProviderDto.phone2) ? createProviderDto.phone2.toString() : null,
          email1: createProviderDto.email1,
          email2: (createProviderDto.email2) ? createProviderDto.email2 : null,
          description: (createProviderDto.description) ? createProviderDto.description : null,
          userCreateAt: "123456789", //TODO -> Falta el tema de la auth.
          createDateAt: new Date(),
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      })

      return new ApiTransactionResponse(
        newProvider,
        EResponseCodes.OK,
        "Proveedor registrado correctamente."
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar crear el proveedor: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar crear el proveedor"
      );
      
    } finally {
      
      this.logger.log(`Creación de proveedor finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<IProvider> | Object> {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación con listar todos los proveedores"
    );
    
  }

  async findOne(id: number): Promise<ApiTransactionResponse<IProvider | string>> {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación con mostrar proveedor por ID"
    );
    
  }

  async update(id: number, updateProviderDto: UpdateProviderDto): Promise<ApiTransactionResponse<IProvider | string>> {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación con actualizar un proveedor"
    );
    
  }

  async remove(id: number): Promise<ApiTransactionResponse<IProvider | string>> {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación con remover lógicamente un proveedor"
    );
    
  }

}
