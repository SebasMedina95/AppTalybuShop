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
import { PageMetaDto } from '../../helpers/paginations/dto/page-meta.dto';

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
    
    const { take, page, search, order, sort } = pageOptionsDto;
    let getProviders: IProvider[] = [];
    let itemCount: number = 0;
    let whereCondition = {};

    //* Si no se especifican los valores, se usan los predeterminados
    const takeValue = take || 10;  // Elementos por página
    const pageValue = page || 1;   // Página actual
    const skip = (pageValue - 1) * takeValue;  // Calcular el offset para Prisma
    const orderValue = order || 'asc';  // Orden predeterminado ascendente
    const sortBy = sort || 'id';  // Columna por defecto para ordenar

    try {

      //? Si vamos a realizar además de la paginación una búsqueda
      if( search && search !== "" && search !== null && search !== undefined ){

        whereCondition = {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { phone1: { contains: search, mode: 'insensitive' } },
            { phone2: { contains: search, mode: 'insensitive' } },
            { email1: { contains: search, mode: 'insensitive' } },
            { email2: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        };

      }

      //? Consultar con Prisma la paginación, orden y búsqueda
      const [items, totalItems] = await Promise.all([
        this.prisma.tBL_PROVIDERS.findMany({
          where: whereCondition,
          take: takeValue,
          skip: skip,
          orderBy: {
            [sortBy]: orderValue,
          },
        }),
        this.prisma.tBL_PROVIDERS.count({ where: whereCondition }),
      ]);

      //? Organizamos los parámetros obtenidos para devolver en la consulta
      itemCount = totalItems;
      getProviders = items;

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(getProviders, pageMetaDto);
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener listado de proveedores: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener el listado de proveedores"
      );
      
    } finally {
      
      this.logger.log(`Listado de proveedores finalizada`);
      await this.prisma.$disconnect();

    }


    
  }

  async findOne(id: number): Promise<ApiTransactionResponse<IProvider | string>> {
    
    try {
      
      const getProvider = await this.prisma.tBL_PROVIDERS.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        }
      });

      if( !getProvider || getProvider == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado un proveedor con el ID ${id}`
        );
      }

      return new ApiTransactionResponse(
        getProvider,
        EResponseCodes.OK,
        `Proveedor obtenido correctamente`
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener un proveedor por su ID: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener un proveedor por su ID"
      );
      
    } finally {
      
      this.logger.log(`Obtener proveedor por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
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
