import { 
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductsService } from './products.service';
import { FilesService } from '../../helpers/files/files.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { CustomError } from '../../helpers/errors/custom.error';
import { IErrorImages, IImagesSimpleTable, IProducts } from './interfaces/products.interface';
import { MaxFileSizeValidator } from './validators/max-file-size-validator';
import { FileTypeValidator } from './validators/file-type-validator';
import { EResponseCodes } from 'src/constants/ResponseCodesEnum';

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: FilesService
  ) {}

  //* El cargue de imágenes será interceptado desde el Gateway y de allí las enviamos para acá y es acá
  //* donde haremos las validaciones común y corriente.
  @MessagePattern({ cmd: 'create_product' })
  async create(
    @Payload() createProductDto: CreateProductDto,
  ): Promise<ApiTransactionResponse<IProducts | string | IErrorImages[] | CustomError>> {

    //* Capturar errores y nombres de imágenes.
    let errorsImages: IErrorImages[] = [];
    let imagesNames: string[] = [];

    //* Esto lo tuvimos que hacer porque desde el gateway enviamos [{},{},{} ...] 
    //* pero acá nos está llegando como [[],[],[] ...] y adicional, el buffer no me 
    //* llega como Buffer sino como un objeto, entonces hacemos un reconversión para garantizar la carga entrante
    let arrayProcess: Express.Multer.File[] = [];
    for (const iterImgs of createProductDto.imagesProducts) {
      const obj = {
        ...iterImgs,
        buffer: Buffer.from(iterImgs.buffer.data)
      }
      arrayProcess.push(obj)
    }

    //* Si me llega en la carga imágenes
    if (arrayProcess) {

      //* Usamos los validadores personalizados que creamos y no los de nest.
      const maxFileSizeValidator = new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }); // 4 MB
      const fileTypeValidator = new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' });

      for (const iterImgs of arrayProcess) {
            
        if (!maxFileSizeValidator.isValid(iterImgs)) {
          errorsImages.push({
            error: "El tamaño de la imagen sobrepasa las 4MB",
            fileError: iterImgs.originalname
          });
        }

        if (!fileTypeValidator.isValid(iterImgs)) {
          errorsImages.push({
            error: "El formato de la imagen es diferente a .(png|jpg|jpeg)",
            fileError: iterImgs.originalname
          });
        }

        imagesNames.push(iterImgs.originalname);
        
      }

    }

    if( errorsImages.length > 0 ){
      return new ApiTransactionResponse(
        errorsImages,
        EResponseCodes.FAIL,
        "Las imágenes de los productos que intenta cargar tienen errores, revise tamaños y formatos."
      );
    }

    //? Registremos primero el producto
    const saveProduct = await this.productsService.create(createProductDto);
    if( saveProduct instanceof CustomError  ){
      return new ApiTransactionResponse(
        saveProduct.message,
        EResponseCodes.FAIL,
        "Ocurrieron errores, no se pudo registrar el producto."
      );
    }

    //? Registramos las imágenes
    if( arrayProcess && errorsImages.length == 0 ){

      const product = saveProduct as IProducts;
      for (const iterImages of arrayProcess) {
        
        let executeFile = this.cloudinaryService.uploadFile(iterImages);

        executeFile.then( async(p)  => {

          const url_cloudinary = p.url;
          const objReg: IImagesSimpleTable = {
            url: url_cloudinary,
            productId: product.id
          }
  
          await this.productsService.createImages(objReg);
  
        })

      }

    }

    return new ApiTransactionResponse(
      saveProduct,
      EResponseCodes.OK,
      "Producto registrado correctamente."
    );

  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
