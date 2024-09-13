import { Injectable, Logger } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PrismaService } from '../../config/database/prisma.service';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';

import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { CustomError } from '../../helpers/errors/custom.error';
import { optimizeForSEO } from '../../helpers/convert_url/convertForUrl';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';
import { PageMetaDto } from '../../helpers/paginations/dto/page-meta.dto';

import { ISubCategory } from './interfaces/subcategories.interfaces';

@Injectable()
export class SubcategoriesService {

  private readonly logger = new Logger('SubcategoriesService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  constructor(
    private prisma: PrismaService
  ){}

  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<ApiTransactionResponse<ISubCategory | CustomError>> {

    try {
      
      //? Convirtamos para las urls de la categoría
      const urlConvert: string = optimizeForSEO(createSubcategoryDto.name);

      //? Corroborar que la categoría seleccionada existe
      const existCategory = await this.prisma.tBL_CATEGORIES.findUnique({
        where: { id : createSubcategoryDto.categoryId }
      })

      if( !existCategory ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          "La categoría que intenta asociar no existe."
        );
      }

      //? Validemos que no se repita ni el nombre ni la URL
      const existSubCategory = await this.prisma.tBL_SUBCATEGORIES.findMany({
        where: {
          OR: [
            { name: createSubcategoryDto.name.toUpperCase() },
            { url: urlConvert }
          ]
        }
      })

      if( existSubCategory.length > 0 ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          "La categoría ya se encuentra registrada en la base de datos."
        );
      }

      //? Procedemos a registrar la información
      const newSubCategory = await this.prisma.tBL_SUBCATEGORIES.create({
        data: {
          categoryId: createSubcategoryDto.categoryId,
          name: createSubcategoryDto.name.toUpperCase(),
          url: urlConvert,
          status: true,
          description: createSubcategoryDto.description,
          userCreateAt: "123456789", //TODO -> Falta el tema de la auth.
          createDateAt: new Date(),
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      })

      return new ApiTransactionResponse(
        newSubCategory,
        EResponseCodes.OK,
        "Sub Categoría registrada correctamente."
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar crear la categoría: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar crear la categoría"
      );
      
    } finally {
      
      this.logger.log(`Creación de categoría finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ISubCategory> | Object> {
    
    const { take, page, search, order, sort } = pageOptionsDto;
    let getSubCategories: ISubCategory[] = [];
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
            { description: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } },
            // Búsqueda en los campos de la categoría relacionada
            { category: { name: { contains: search, mode: 'insensitive' } } },
            { category: { icon: { contains: search, mode: 'insensitive' } } },
            { category: { url: { contains: search, mode: 'insensitive' } } },
            { category: { description: { contains: search, mode: 'insensitive' } } }
          ],
        };

      }

      //? Consultar con Prisma la paginación, orden y búsqueda
      const [items, totalItems] = await Promise.all([
        this.prisma.tBL_SUBCATEGORIES.findMany({
          where: whereCondition,
          take: takeValue,
          skip: skip,
          orderBy: {
            [sortBy]: orderValue,
          },
          include: {
            category: true
          }
        }),
        this.prisma.tBL_SUBCATEGORIES.count({ where: whereCondition }),
      ]);

      //? Organizamos los parámetros obtenidos para devolver en la consulta
      //? Convertimos también el campo 'tags' de string a array en cada item
      getSubCategories = items;
      itemCount = totalItems;

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(getSubCategories, pageMetaDto);
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener listado de sub categorías: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener el listado de sub categorías"
      );
      
    } finally {
      
      this.logger.log(`Listado de sub categorías finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findOne(id: number): Promise<ApiTransactionResponse<ISubCategory | string>> {
    
    try {
      
      const getSubCategory = await this.prisma.tBL_SUBCATEGORIES.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        },
        include: { category: true }
      });

      if( !getSubCategory || getSubCategory == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una sub categoría con el ID ${id}`
        );
      }

      return new ApiTransactionResponse(
        getSubCategory,
        EResponseCodes.OK,
        `Sub Categoría obtenida correctamente`
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener una sub categoría por su ID: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener una sub categoría por su ID"
      );
      
    } finally {
      
      this.logger.log(`Obtener sub categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    
    try {

      //? Verificamos que exista el ID solicitado
      const existCategoryById = await this.findOne(id);

      if( existCategoryById.data == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una sub categoría con el ID ${id}`
        );
      }

      //? Verificamos que no se repita el nombre que es Unique ni la URL
      const urlConvert: string = optimizeForSEO(updateSubcategoryDto.name);

      const existSubCategoryByNameOrUrl = await this.prisma.tBL_SUBCATEGORIES.findFirst({
        where: {
          OR: [
            { name: updateSubcategoryDto.name.trim().toUpperCase() },
            { url: urlConvert }
          ]
        }
      });

      if( existSubCategoryByNameOrUrl ){
        if( existSubCategoryByNameOrUrl.id != id ){
          return new ApiTransactionResponse(
            null,
            EResponseCodes.FAIL,
            `Ya existe el nombre de la sub categoría`
          );
        }
      }

      //? Llegamos hasta acá, actualizamos entonces:
      const updateSubCategory = await this.prisma.tBL_SUBCATEGORIES.update({
        where: { id },
        data: {
          categoryId: updateSubcategoryDto.categoryId,
          name: updateSubcategoryDto.name,
          url: urlConvert,
          description: updateSubcategoryDto.description,
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      });

      return new ApiTransactionResponse(
        updateSubCategory,
        EResponseCodes.OK,
        "Sub Categoría actualizada correctamente"
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar actualizar la sub categoría: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar actualizar la sub categoría"
      );
      
    } finally {
      
      this.logger.log(`Actualización de sub categoría finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
