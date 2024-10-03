import { 
  Inject, 
  Injectable, 
  Logger 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../config/database/prisma.service';

import { CreateOrdersPurchaseDto } from './dto/create-orders-purchase.dto';
import { UpdateOrdersPurchaseDto } from './dto/update-orders-purchase.dto';

import { ApiTransactionResponse } from '../../utils/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';
import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';

import { CustomError } from '../../helpers/errors/custom.error';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';
import { PageMetaDto } from '../../helpers/paginations/dto/page-meta.dto';

import { IOrders } from './interfaces/orders.interface';
import { PRODUCTS_SERVICE } from '../../config/services';
import { OrderPurchaseItemDto } from './dto/item-order-purchase.dto';
import { IProducts } from './interfaces/products.interface';

@Injectable()
export class OrdersPurchaseService {

  private readonly logger = new Logger('OrdersPurchaseService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  constructor(
    private prisma: PrismaService,
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
  ){}

  async create(
    createOrdersPurchaseDto: CreateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError | string>> {

    try {

      //? Primeramente, validemos la integridad de los productos
      //* Recordemos que para trabajar la promesa debemos usar firstValueFrom
      //* pues inicialmente hablamos de un Observable()
      const getProducts: ApiTransactionResponse<any[]> = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'validate_products_for_purcharse_orders' }, 
          createOrdersPurchaseDto.items)
      )

      if( getProducts.data == null ){
        return new ApiTransactionResponse(
          getProducts.operation.message,
          EResponseCodes.OK,
          "Error al registrar la Orden de Pago."
        );
      }

      //* SI LLEGAMOS HASTA ACÁ LA DATA ESTÁ OK :) !
      //? Ahora, debemos de generar el código de factura
      //? Como lo capturamos a nivel de horas con segundos no debería repetirse
      const generateFactureCode: string = this.generateCodeFacture();

      //? Calculo el valor total
      //! Priorizaré la legibilidad y entendimiento del código:
      let totalAmount: number = 0;
      let totalItems: number = 0;
      let productsProcess: IProducts[] = getProducts.data;
      for (let i = 0; i < createOrdersPurchaseDto.items.length; i++) {
        
        totalAmount += createOrdersPurchaseDto.items[i].quantity;
        totalItems += Number(productsProcess[i].price) * createOrdersPurchaseDto.items[i].quantity;
        
      }

      //? Creamos la transacción (Dos movimientos en un solo)
      const order = await this.prisma.tBL_PURCHASE_ORDER.create({
        data: {
          factureCode: generateFactureCode,
          totalAmount: totalAmount,
          totalItems: totalItems,
          description: createOrdersPurchaseDto.description,
          paid: false,
          status: "PENDIENTE",
          userCreateAt: "123456789", //TODO -> Falta el tema de la auth.
          createDateAt: new Date(),
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
          OrderItems: {              //REGISTRO DINÁMICO en paralelo.
            createMany: {
              data: createOrdersPurchaseDto.items.map( (orderItem) => ({
                quantity: orderItem.quantity,
                size: orderItem.size,
                color: orderItem.color,
                productId: orderItem.productId,
                price: productsProcess.find( p => p.id === orderItem.productId ).price
              }))
            }
          }
        }
      })

      return new ApiTransactionResponse(
        order,
        EResponseCodes.OK,
        "Orden de Pago registrada correctamente."
      );

    } catch (error) {

      console.log(error);
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

      //getPurchaseOrders = items;
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

    try {
      
      const getPurchaseOrder = await this.prisma.tBL_PURCHASE_ORDER.findFirst({
        where: {
          id
        }
      });

      if( !getPurchaseOrder || getPurchaseOrder == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una categoría con el ID ${id}`
        );
      }

      return new ApiTransactionResponse(
        //getPurchaseOrder,
        null,
        EResponseCodes.OK,
        `Orden de Pago obtenida correctamente`
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener una Orden de Pago por su ID: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener una Orden de Pago por su ID"
      );
      
    } finally {
      
      this.logger.log(`Obtener Orden de Pago por ID finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findOneByCode(
    code: string
  ): Promise<ApiTransactionResponse<IOrders | string>> {

    try {
      
      const getPurchaseOrder = await this.prisma.tBL_PURCHASE_ORDER.findFirst({
        where: { factureCode: code }
      });

      if( !getPurchaseOrder || getPurchaseOrder == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una categoría con el Código de Factura ${code}`
        );
      }

      return new ApiTransactionResponse(
        //getPurchaseOrder,
        null,
        EResponseCodes.OK,
        `Orden de Pago obtenida correctamente`
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener una Orden de Pago por su Código de Factura: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener una Orden de Pago por su Código de Factura"
      );
      
    } finally {
      
      this.logger.log(`Obtener Orden de Pago por Código de Factura finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async changedOrderStatus(
    updateOrdersPurchaseDto: UpdateOrdersPurchaseDto
  ): Promise<ApiTransactionResponse<IOrders | CustomError>> {

    try {
      
      //? Verificamos que exista el ID solicitado
      const existOrderPurchaseById = await this.findOne(updateOrdersPurchaseDto.id);

      if( existOrderPurchaseById.data == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una orden de pago con el ID ${updateOrdersPurchaseDto.id}`
        );
      }

      //? Llegamos hasta acá, actualizamos entonces:
      const updatePurchaseOrder = await this.prisma.tBL_PURCHASE_ORDER.update({
        where: { id: updateOrdersPurchaseDto.id },
        data: {
          status: updateOrdersPurchaseDto.status,
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      });

      return new ApiTransactionResponse(
        //updatePurchaseOrder,
        null,
        EResponseCodes.OK,
        "Orden de Pago actualizada correctamente"
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar actualizar la Orden de Pago: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar actualizar la Orden de Pago"
      );
      
    } finally {
      
      this.logger.log(`Actualización de Orden de Pago finalizada`);
      await this.prisma.$disconnect();

    }

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
