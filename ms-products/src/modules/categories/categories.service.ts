import { Injectable,
         Logger } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { CustomError } from '../../helpers/errors/custom.error';
import { optimizeForSEO } from '../../helpers/convert_url/convertForUrl';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';
import { PageMetaDto } from '../../helpers/paginations/dto/page-meta.dto';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';
import { PrismaService } from '../../config/database/prisma.service';

import { ICategory } from './interfaces/categories.interface';
import { ISubCategory } from '../subcategories/interfaces/subcategories.interfaces';

@Injectable()
export class CategoriesService {

  private readonly logger = new Logger('CategoriesService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  constructor(
    private prisma: PrismaService
  ){}

  async create(createCategoryDto: CreateCategoryDto): Promise<ApiTransactionResponse<ICategory | CustomError>> {

    try {
      
      //? Convirtamos para las urls de la categoría
      const urlConvert: string = optimizeForSEO(createCategoryDto.name);

      //? Validemos que no se repita ni el nombre ni la URL
      const existCategory = await this.prisma.tBL_CATEGORIES.findMany({
        where: {
          OR: [
            { name: createCategoryDto.name.toUpperCase() },
            { url: urlConvert }
          ]
        }
      })

      if( existCategory.length > 0 ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          "La categoría ya se encuentra registrada en la base de datos."
        );
      }

      //? Ajustamos los tags
      const tagsConvert: string = JSON.stringify(createCategoryDto.tags);

      //? Procedemos a registrar la información
      const newCategory = await this.prisma.tBL_CATEGORIES.create({
        data: {
          name: createCategoryDto.name.toUpperCase(),
          url: urlConvert,
          tags: tagsConvert,
          icon: createCategoryDto.icon,
          description: createCategoryDto.description,
          userCreateAt: "123456789", //TODO -> Falta el tema de la auth.
          createDateAt: new Date(),
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      })

      return new ApiTransactionResponse(
        newCategory,
        EResponseCodes.OK,
        "Categoría registrada correctamente."
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

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ICategory> | Object> {
    
    const { take, page, search, order, sort } = pageOptionsDto;
    let getCategories: ICategory[] = [];
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
            { icon: { contains: search, mode: 'insensitive' } },
          ],
        };

      }

      //? Consultar con Prisma la paginación, orden y búsqueda
      const [items, totalItems] = await Promise.all([
        this.prisma.tBL_CATEGORIES.findMany({
          where: whereCondition,
          take: takeValue,
          skip: skip,
          orderBy: {
            [sortBy]: orderValue,
          },
        }),
        this.prisma.tBL_CATEGORIES.count({ where: whereCondition }),
      ]);

      //? Organizamos los parámetros obtenidos para devolver en la consulta
      //? Convertimos también el campo 'tags' de string a array en cada item
      const getCategories = items.map((item) => {
        return {
          ...item,
          tags: item.tags ? JSON.parse(item.tags) : [],  // Convertir 'tags' de JSON string a array
        };
      });
      itemCount = totalItems;

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(getCategories, pageMetaDto);
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener listado de categorías: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener el listado de categorías"
      );
      
    } finally {
      
      this.logger.log(`Listado de categorías finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findOne(id: number): Promise<ApiTransactionResponse<ICategory | string>> {
    
    try {
      
      const getCategory = await this.prisma.tBL_CATEGORIES.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        }
      });

      if( !getCategory || getCategory == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una categoría con el ID ${id}`
        );
      }

      //? Hagamos la conversión para los tags
      const categoryResponse = getCategory
      ? {
          ...getCategory,
          tags: getCategory.tags ? JSON.parse(getCategory.tags) : [],  // Convertir 'tags' de JSON string a array
        }
      : null;

      return new ApiTransactionResponse(
        categoryResponse,
        EResponseCodes.OK,
        `Categoría obtenida correctamente`
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener una categoría por su ID: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener una categoría por su ID"
      );
      
    } finally {
      
      this.logger.log(`Obtener categoría por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    
    try {
      
      //? Verificamos que exista el ID solicitado
      const existCategoryById = await this.findOne(id);

      if( existCategoryById.data == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una categoría con el ID ${id}`
        );
      }

      //? Verificamos que no se repita el nombre que es Unique ni la URL
      const urlConvert: string = optimizeForSEO(updateCategoryDto.name);

      const existCategoryByNameOrUrl = await this.prisma.tBL_CATEGORIES.findFirst({
        where: {
          OR: [
            { name: updateCategoryDto.name.trim().toUpperCase() },
            { url: urlConvert }
          ]
        }
      });

      if( existCategoryByNameOrUrl ){
        if( existCategoryByNameOrUrl.id != id ){
          return new ApiTransactionResponse(
            null,
            EResponseCodes.FAIL,
            `Ya existe el nombre de la categoría`
          );
        }
      }

      //? Llegamos hasta acá, actualizamos entonces:
      const updateCategory = await this.prisma.tBL_CATEGORIES.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          url: urlConvert,
          icon: updateCategoryDto.icon,
          tags: JSON.stringify(updateCategoryDto.tags),
          description: updateCategoryDto.description,
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      });

      return new ApiTransactionResponse(
        updateCategory,
        EResponseCodes.OK,
        "Categoría actualizada correctamente"
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar actualizar la categoría: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar actualizar la categoría"
      );
      
    } finally {
      
      this.logger.log(`Actualización de categoría finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async remove(id: number): Promise<ApiTransactionResponse<ICategory | string>> {
    
    try {
      
      //Verificamos que exista el ID solicitado
      const existCategoryById = await this.findOne(id);

      if( existCategoryById.data == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado una categoría con el ID ${id}`
        );
      }

      //Llegamos hasta acá, actualizamos entonces:
      const updateCategory = await this.prisma.tBL_CATEGORIES.update({
        where: { id },
        data: {
          status: false,
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      });

      return new ApiTransactionResponse(
        updateCategory,
        EResponseCodes.OK,
        "Categoría eliminada correctamente"
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar eliminar lógicamente la categoría: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar eliminar lógicamente la categoría"
      );
      
    } finally {
      
      this.logger.log(`Eliminación lógica de categoría finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findSubCategories(id: number): Promise<ApiTransactionResponse<ISubCategory[] | string>> {
    
    try {
      
      const getSubCategory = await this.prisma.tBL_SUBCATEGORIES.findMany({
        where: {
          AND: [
            { categoryId: id },
            { status: true }
          ]
        },
        include: { category: true }
      });

      //? Para el tema de los tags
      const formattedSubCategories = getSubCategory.map((subCategory) => ({
        ...subCategory,
        category: {
          ...subCategory.category,
          tags: subCategory.category.tags ? JSON.parse(subCategory.category.tags) : [], // Convertir 'tags' a array
        },
      }));

      return new ApiTransactionResponse(
        formattedSubCategories,
        EResponseCodes.OK,
        `Sub Categorías obtenidas correctamente`
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener las subcategorías por su ID: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener las subcategorías"
      );
      
    } finally {
      
      this.logger.log(`Obtener subcategorías de categoría`);
      await this.prisma.$disconnect();

    }
    
  }

}
