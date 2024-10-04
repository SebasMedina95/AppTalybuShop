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
import { AddImagesProductDto } from './dto/add-images-product.dto';
import { RemoveImagesProductDto } from './dto/remove-images-product.dto';
import { OrderPurchaseItemDto } from './dto/item-order-purchase.dto';

import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';

import { CustomError } from '../../helpers/errors/custom.error';
import { IErrorImages, IImagesSimpleTable, IProducts } from './interfaces/products.interface';
import { MaxFileSizeValidator } from './validators/max-file-size-validator';
import { FileTypeValidator } from './validators/file-type-validator';

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

  @MessagePattern({ cmd: 'get_products_paginated' })
  async findAll(
    @Payload() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<IProducts> | Object> {

    return this.productsService.findAll(pageOptionsDto);

  }

  @MessagePattern({ cmd: 'get_product_by_id' })
  async findOne(
    @Payload('id') id: number
  ): Promise<ApiTransactionResponse<IProducts | string>> {

    return this.productsService.findOne(id);

  }

  //* Imágenes manejadas como en el crear
  @MessagePattern({ cmd: 'add_images_product' })
  async addImagesProduct(
    @Payload() addImagesProductDto: AddImagesProductDto,
  ): Promise<ApiTransactionResponse<IProducts | string | IErrorImages[] | CustomError>> {

    //* Capturar errores y nombres de imágenes.
    let errorsImages: IErrorImages[] = [];
    let imagesNames: string[] = [];

    //* Esto lo tuvimos que hacer porque desde el gateway enviamos [{},{},{} ...] 
    //* pero acá nos está llegando como [[],[],[] ...] y adicional, el buffer no me 
    //* llega como Buffer sino como un objeto, entonces hacemos un reconversión para garantizar la carga entrante
    let arrayProcess: Express.Multer.File[] = [];
    for (const iterImgs of addImagesProductDto.imagesProducts) {
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

    //? Verificamos que el producto exista
    const getProductById = await this.findOne(addImagesProductDto.productId)
    if( getProductById instanceof CustomError || getProductById.data == null  ){
      return new ApiTransactionResponse(
        null,
        EResponseCodes.FAIL,
        "No podemos agregar nuevas imágenes a un producto que no existe."
      );
    }

    //? Registramos las imágenes
    if( arrayProcess && errorsImages.length == 0 ){

      for (const iterImages of arrayProcess) {
        
        let executeFile = this.cloudinaryService.uploadFile(iterImages);

        executeFile.then( async(p)  => {

          const url_cloudinary = p.url;
          const objReg: IImagesSimpleTable = {
            url: url_cloudinary,
            productId: addImagesProductDto.productId
          }
  
          await this.productsService.createImages(objReg);
  
        })

      }

    }

    //* Esto es para mejorar la respuesta pero no es necesario
    const getProductByIdUpdated = await this.findOne(addImagesProductDto.productId);

    return new ApiTransactionResponse(
      getProductByIdUpdated.data,
      EResponseCodes.OK,
      "Imágenes de producto anexadas correctamente."
    );

  }

  @MessagePattern({ cmd: 'remove_images_product' })
  async removeImagesProduct(
    @Payload() removeImagesProductDto: RemoveImagesProductDto,
  ): Promise<ApiTransactionResponse<IProducts | string | CustomError>> {

    //? Verificamos que el producto exista
    const getProductById = await this.findOne(removeImagesProductDto.productId)
    if( getProductById instanceof CustomError || getProductById.data == null  ){
      return new ApiTransactionResponse(
        null,
        EResponseCodes.FAIL,
        "No podemos remover imágenes a un producto que no existe."
      );
    }

    const getImages = await this.productsService.imagesByProduct(Number(removeImagesProductDto.productId));
    if( getImages.length > 0 ){

      //Debemos segmentar las que vamos a eliminar:
      const arrayDeleteElementsIds: number[] = JSON.parse(removeImagesProductDto.imagesIdDelete);

      //Las removemos de Cloudinary
      for (const iterImages of getImages) {

        //*Si esta incluido, lo borramos, porque no siempre es borrar todas las imágenes
        if( arrayDeleteElementsIds.includes(iterImages.id) ){

          const arrayName = iterImages.url.split('/');
          const getName = arrayName[arrayName.length - 1];
          const [ name , ext ] = getName.split('.');

          //Borramos con una función propia de cloudinary
          await this.cloudinaryService.deleteFile(name);

          //Las removemos de la base de datos
          await this.productsService.deleteImagesByProduct(Number(iterImages.id));

        }

      }

    }

    //* Esto es para mejorar la respuesta pero no es necesario
    const getProductByIdRemoveImages = await this.findOne(removeImagesProductDto.productId);

    return new ApiTransactionResponse(
      getProductByIdRemoveImages.data,
      EResponseCodes.OK,
      "Imágenes de producto removidas correctamente."
    );

  }


  @MessagePattern({ cmd: 'update_product' })
  async update(
    @Payload() updateProductDto: UpdateProductDto
  ): Promise<ApiTransactionResponse<IProducts | string | CustomError>> {

    const updateProduct = await this.productsService.update(Number(updateProductDto.id), updateProductDto);
    if( updateProduct instanceof CustomError  ){
      return new ApiTransactionResponse(
        updateProduct.message,
        EResponseCodes.FAIL,
        "Ocurrieron errores, no se pudo actualizar el producto."
      );
    }

    return new ApiTransactionResponse(
      updateProduct,
      EResponseCodes.OK,
      "Producto actualizado correctamente."
    );


  }

  @MessagePattern({ cmd: 'remove_logic_product' })
  async remove(
    @Payload('id') id: number
  ): Promise<ApiTransactionResponse<IProducts | string>> {

    return this.productsService.remove(id);

  }

  @MessagePattern({ cmd: 'validate_products_for_purcharse_orders' })
  async validateProducts(
    @Payload() orderPurcharseValid: OrderPurchaseItemDto[]
  ): Promise<ApiTransactionResponse<IProducts[] | OrderPurchaseItemDto[] | string>> {

    return this.productsService.validateProducts(orderPurcharseValid);

  }

  @MessagePattern({ cmd: 'get_products_by_array_ids' })
  async getProductsByArrayIds(
    @Payload() ids: number[]
  ): Promise<ApiTransactionResponse<IProducts[] | string>> {

    return this.productsService.getProductsByArrayIds(ids);

  }

}
