import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

import { CreateOrdersPurchaseDto } from './dto/create-orders-purchase.dto';
import { UpdateOrdersPurchaseDto } from './dto/update-orders-purchase.dto';

import { ApiTransactionResponse } from '../../utils/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';
import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';
import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';

import { IOrders } from './interfaces/orders.interface';
import { PageMetaDto } from 'src/helpers/paginations/dto/page-meta.dto';

@Injectable()
export class OrdersPurchaseService {

  private readonly logger = new Logger('OrdersPurchaseService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  constructor(
    private prisma: PrismaService
  ){}

  async create(
    createOrdersPurchaseDto: CreateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    try {

      //? Debemos de generar el código de factura
      //? Como lo capturamos a nivel de horas con segundos no debería repetirse
      const generateFactureCode: string = this.generateCodeFacture();

      const newOrderPurchase = await this.prisma.tBL_PURCHASE_ORDER.create({
        data: {
          factureCode: generateFactureCode,
          totalAmount: createOrdersPurchaseDto.totalAmount,
          totalItems: createOrdersPurchaseDto.totalItems,
          description: createOrdersPurchaseDto.description,
          paid: false,
          status: "PENDIENTE",
          userCreateAt: "123456789", //TODO -> Falta el tema de la auth.
          createDateAt: new Date(),
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      })

      return new ApiTransactionResponse(
        newOrderPurchase,
        EResponseCodes.OK,
        "Categoría registrada correctamente."
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar crear la orden de pago: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar crear la orden de pago"
      );
      
    } finally {
      
      this.logger.log(`Creación de orden de pago finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findAll(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<IOrders> | Object> {

    const { take, page, search, order, sort } = pageOptionsDto;
    let getPurchaseOrders: IOrders[] = [];
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
            { factureCode: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        };

      }

      //? Consultar con Prisma la paginación, orden y búsqueda
      const [items, totalItems] = await Promise.all([
        this.prisma.tBL_PURCHASE_ORDER.findMany({
          where: whereCondition,
          take: takeValue,
          skip: skip,
          orderBy: {
            [sortBy]: orderValue,
          },
        }),
        this.prisma.tBL_PURCHASE_ORDER.count({ where: whereCondition }),
      ]);

      getPurchaseOrders = items;
      itemCount = totalItems;

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(getPurchaseOrders, pageMetaDto);
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener listado de ordenes de pago: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener el listado de ordenes de pago"
      );
      
    } finally {
      
      this.logger.log(`Listado de ordenes de pago finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findOne(
    id: number
  ): Promise<ApiTransactionResponse<IOrders | string>> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test obtener una orden de pago dado su ID."
    );

  }

  async findOneByCode(
    code: string
  ): Promise<ApiTransactionResponse<IOrders | string>> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test obtener una orden de pago dado su Código."
    );

  }

  async changedOrderStatus(
    updateOrdersPurchaseDto: UpdateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Test actualizar el estado de una orden de pago."
    );

  }

  private generateCodeFacture(): string {

    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day: string = currentDate.getDate().toString().padStart(2, '0');
    const hours: string = currentDate.getHours().toString().padStart(2, '0');
    const minutes: string = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds: string = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds: string = currentDate.getMilliseconds().toString().padStart(3, '0');

    return `FACV-${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

  }

}
