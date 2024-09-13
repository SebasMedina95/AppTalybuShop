import { Injectable, Logger } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { PrismaService } from '../../config/database/prisma.service';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';

import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { CustomError } from '../../helpers/errors/custom.error';
import { optimizeForSEO } from '../../helpers/convert_url/convertForUrl';

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

  async findAll() {
    return `This action returns all subcategories`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  async remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
