import { Injectable, Logger } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { CustomError } from '../../helpers/errors/custom.error';
import { optimizeForSEO } from '../../helpers/convert_url/convertForUrl';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';
import { PrismaService } from '../../config/database/prisma.service';
import { ICategory } from './interfaces/categories.interface';

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

  async findAll() {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación - Mostrar categorías paginadas y con filtro."
    );
    
  }

  async findOne(id: number) {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación - Mostrar categoría por ID."
    );
    
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación - Actualización de categorías."
    );
    
  }

  async remove(id: number) {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación - Eliminación lógica de categorías."
    );
    
  }
}
