import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';

@Injectable()
export class CategoriesService {

  private readonly logger = new Logger('CategoriesService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  async create(createCategoryDto: CreateCategoryDto) {
    
    return new ApiTransactionResponse(
      null,
      EResponseCodes.INFO,
      "Comunicación - Registro de categorías."
    );
    
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
