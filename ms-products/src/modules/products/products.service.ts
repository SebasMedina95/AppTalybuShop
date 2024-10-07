import { Injectable, Logger, Get } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';
import { PageMetaDto } from '../../helpers/paginations/dto/page-meta.dto';
import { OrderPurchaseItemDto } from './dto/item-order-purchase.dto';

import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { CustomError } from '../../helpers/errors/custom.error';

import { ApiTransactionResponse } from '../../util/ApiResponse';
import { EResponseCodes } from '../../constants/ResponseCodesEnum';
import { IImagesSimpleTable, IProducts } from './interfaces/products.interface';
import { ValidSizesArray, ValidTypesArray } from '../../types/product.type';
import { Image } from './entities/image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  private readonly errorsSQL = new MySqlErrorsExceptions();

  constructor(
    private prisma: PrismaService
  ){}

  async create(createProductDto: CreateProductDto): Promise<IProducts | string | CustomError> {
    
    try{

      //* 1. Ajustemos los sizes 
      const getSizesFromRequest = createProductDto.sizes;
      const applySplitSizes: string[] = getSizesFromRequest.split(',');
      
      let sizeValid: string[] = [];
      let sizeInvalid: string[] = [];
      for (const iterSizes of applySplitSizes) {
        if( !ValidSizesArray.includes(iterSizes) ){
          sizeInvalid.push(iterSizes);
        }else{
          sizeValid.push(iterSizes);
        }
      }

      if( sizeInvalid.length > 0 ){
        return CustomError.badRequestError(`Las siguientes tallas son inválidas: ${sizeInvalid}`);
      }

      //* 2. Ajustemos los types
      const getTypesFromRequest = createProductDto.type;
      const applySplitTypes: string[] = getTypesFromRequest.split(',');

      let typeValid: string[] = [];
      let typeInvalid: string[] = [];
      for (const iterTypes of applySplitTypes) {
        if( !ValidTypesArray.includes(iterTypes) ){
          typeInvalid.push(iterTypes);
        }else{
          typeValid.push(iterTypes);
        }
      }

      if( typeInvalid.length > 0 ){
        return CustomError.badRequestError(`Los siguientes tipos son inválidos: ${typeInvalid}`);
      }

      //* 3. Ajustamos los tags
      const getTagsFromRequest = createProductDto.tags;
      const applySplitTags: string[] = getTagsFromRequest.split(',');

      let tagsValid: string[] = [];
      for (const iterTags of applySplitTags) {
        tagsValid.push(iterTags.toLowerCase());
      }

      //* 4. Ajustemos los colors
      const getColorsFromRequest = createProductDto.colors;
      const applySplitColors: string[] = getColorsFromRequest.split(',');

      let colorsValid: string[] = [];
      for (const iterColor of applySplitColors) {
        colorsValid.push(iterColor.toLowerCase());
      }

      //* 5. Ajustamos el slug y que no se repita
      const nameProduct = createProductDto.title;
      let slug: string = nameProduct.toLowerCase();

      slug = slug.replace(/ñ/g, 'n'); // Reemplazar la Ñ y ñ por N y n
      slug = slug.replace(/\s+/g, '_'); // Reemplazar espacios por guiones bajos
      slug = slug.replace(/[^\w_]+/g, ''); // Eliminar todos los caracteres no alfanuméricos excepto guiones bajos
      slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Eliminar caracteres especiales (acentos y diacríticos)
      slug = slug.replace(/[^a-z0-9_]/g, ''); // Eliminar carácteres no permitido en URLs que no sean letras, números, o guiones bajos
      slug = slug.replace(/^_+/, ''); // Eliminar guiones bajos al inicio
      slug = slug.replace(/_+$/, ''); // Eliminar guiones bajos al final
      slug = slug.trim(); // Elimino espacios residuales al principio y al final

      //* 6. Validamos no repetición de name ni slug
      const getProductsByNameAndSlug = await this.prisma.tBL_PRODUCTS.findMany({
        where: {
          OR: [
            { title: createProductDto.title },
            { slug }
          ]
        }
      })

      if( getProductsByNameAndSlug.length > 0 )
        return CustomError.badRequestError(`El nombre/slug ya se encuentra registrado`);

    //* 7. Validamos existencia de categoría, sub categoría y proveedor
    const getCategory = await this.prisma.tBL_CATEGORIES.findFirst({ where: { id: Number(createProductDto.categoryId) } });
    const getSubCategory = await this.prisma.tBL_SUBCATEGORIES.findFirst({ where: { id: Number(createProductDto.subCategoryId) } });
    const getProvider = await this.prisma.tBL_PROVIDERS.findFirst({ where: { id: Number(createProductDto.providerId) } });

    if( !getCategory ) return CustomError.badRequestError(`No existe la categoría que intenta seleccionar`);
    if( !getSubCategory ) return CustomError.badRequestError(`No existe la sub categoría que intenta seleccionar`);
    if( !getProvider ) return CustomError.badRequestError(`No existe el proveedor que intenta seleccionar`);

    //* 8 Conversiones de booleanos requeridas (Cómo es form-data para evitar problemas)
    const isDiscountValue: boolean = ( createProductDto.isDiscount == "true" ) ? true : false;
    const isFragileValue: boolean = ( createProductDto.is_fragile == "true" ) ? true : false;

    //* 9. Guardamos (Solo el producto sin imágenes aún).
    const saveProduct = await this.prisma.tBL_PRODUCTS.create({
      data: {
        description: createProductDto.description,
        inStock: createProductDto.inStock,
        price: createProductDto.price,
        sizes: JSON.stringify(sizeValid), //Se guardan arrays como Strings
        tags: JSON.stringify(tagsValid), //Se guardan arrays como Strings
        colors: JSON.stringify(colorsValid), //Se guardan arrays como Strings
        title: createProductDto.title,
        slug,
        type: JSON.stringify(typeValid), //Se guardan arrays como Strings
        brand: createProductDto.brand,
        isDiscount: isDiscountValue,
        percentDiscount: createProductDto.percentDiscount,
        discountStartDate: createProductDto.discountStartDate,
        discountEndDate: createProductDto.discountEndDate,
        is_fragile: isFragileValue,
        views: 0,
        monthsWarranty: createProductDto.monthsWarranty,
        status: true,
        category: {
          connect: {
            id: createProductDto.categoryId, // Conexión con la categoría
          },
        },
        subCategory: {
          connect: {
            id: createProductDto.subCategoryId, // Conexión con la subcategoría
          },
        },
        provider: {
          connect: {
            id: createProductDto.providerId, // Conexión con el proveedor
          },
        },
        userCreateAt: "123456789", //TODO: Pendiente del auth
        createDateAt: new Date(),
        userUpdateAt: "123456789", //TODO: Pendiente del auth
        updateDateAt: new Date(),
      }
    })

    return saveProduct;

    }catch (error) {

      this.logger.log(`Ocurrió un error al intentar crear el producto: ${error}`);
      return CustomError.internalServerError(`Error fatal, transacción fallida`);
      
    } finally {
      
      this.logger.log(`Creación de producto finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async createImages(obj: IImagesSimpleTable): Promise<boolean> {

    const { url, productId } = obj;

    const saveImage = await this.prisma.tBL_IMAGES.create({
      data: {
        url,
        productId,
        userCreateAt: "123456789", //TODO: Pendiente de auth
        createDateAt: new Date()
      }
    });

    if( saveImage ) return true;

    return false;

  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<IProducts> | Object> {
    
    const { take, page, search, order, sort } = pageOptionsDto;
    let getProducts: IProducts[] = [];
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
            { description: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { tags: { contains: search, mode: 'insensitive' } },
            { colors: { contains: search, mode: 'insensitive' } },
            { title: { contains: search, mode: 'insensitive' } },
            { type: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } }
          ],
        };

      }

      //? Consultar con Prisma la paginación, orden y búsqueda
      const [items, totalItems] = await Promise.all([
        this.prisma.tBL_PRODUCTS.findMany({
          where: whereCondition,
          include: {
            category: true,
            subCategory: true,
            provider: true,
            TBL_IMAGES: true,
          },
          take: takeValue,
          skip: skip,
          orderBy: {
            [sortBy]: orderValue,
          },
        }),
        this.prisma.tBL_PRODUCTS.count({ where: whereCondition }),
      ]);

      //? Organizamos los parámetros obtenidos para devolver en la consulta
      //? Convertimos también el campo 'tags' de string a array en cada item
      getProducts = items.map((item) => {
        return {
          ...item,
          tags: item.tags ? JSON.parse(item.tags) : [],  // Convertir 'tags' de JSON string a array
          sizes: item.sizes ? JSON.parse(item.sizes) : [],  // Convertir 'sizes' de JSON string a array
          colors: item.colors ? JSON.parse(item.colors) : [],  // Convertir 'colors' de JSON string a array
          type: item.type ? JSON.parse(item.type) : [],  // Convertir 'colors' de JSON string a array
        };
      });

      itemCount = totalItems;

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(getProducts, pageMetaDto);
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener listado de productos: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener el listado de productos"
      );
      
    } finally {
      
      this.logger.log(`Listado de productos finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async findOne(id: number): Promise<ApiTransactionResponse<IProducts | string>> {
    
    try {
      
      const getProduct = await this.prisma.tBL_PRODUCTS.findFirst({
        where: {
          AND: [
            { id },
            { status: true }
          ]
        },
        include: {
          category: true,
          subCategory: true,
          provider: true,
          TBL_IMAGES: true,
        }
      });

      if( !getProduct || getProduct == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado un producto con el ID ${id}`
        );
      }

      //Convertimos en arreglos para facilitar el front.
      getProduct.sizes = JSON.parse(getProduct.sizes);
      getProduct.tags = JSON.parse(getProduct.tags);
      getProduct.colors = JSON.parse(getProduct.colors);
      getProduct.type = JSON.parse(getProduct.type);

      return new ApiTransactionResponse(
        getProduct,
        EResponseCodes.OK,
        `Producto obtenido correctamente`
      );
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar obtener un producto por su ID: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar obtener un producto por su ID"
      );
      
    } finally {
      
      this.logger.log(`Obtener producto por ID finalizada`);
      await this.prisma.$disconnect();

    }
    
  }

  async imagesByProduct(id: number): Promise<Image[]> {

    const getImages = await this.prisma.tBL_IMAGES.findMany({
      where: { productId: id }
    });

    return getImages;

  }

  async deleteImagesByProduct(id: number): Promise<boolean> {

    const deleteImages = await this.prisma.tBL_IMAGES.delete({
      where: { id }
    });

    if( deleteImages ) return true
    return false;

  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<IProducts | string | CustomError> {
    
    try {
      
      //Verificamos que exista el ID solicitado
      const existProductById = await this.findOne(id);

      if( existProductById.data == null )
        return CustomError.badRequestError(`Producto no encontrado`);

      //1. Ajustemos los sizes 
      const getSizesFromRequest = updateProductDto.sizes;
      const applySplitSizes: string[] = getSizesFromRequest.split(',');
      
      let sizeValid: string[] = [];
      let sizeInvalid: string[] = [];
      for (const iterSizes of applySplitSizes) {
        if( !ValidSizesArray.includes(iterSizes) ){
          sizeInvalid.push(iterSizes);
        }else{
          sizeValid.push(iterSizes);
        }
      }

      if( sizeInvalid.length > 0 ){
        return CustomError.badRequestError(`Las siguientes tallas son inválidas: ${sizeInvalid}`);
      }

      //2. Ajustemos los types
      const getTypesFromRequest = updateProductDto.type;
      const applySplitTypes: string[] = getTypesFromRequest.split(',');

      let typeValid: string[] = [];
      let typeInvalid: string[] = [];
      for (const iterTypes of applySplitTypes) {
        if( !ValidTypesArray.includes(iterTypes) ){
          typeInvalid.push(iterTypes);
        }else{
          typeValid.push(iterTypes);
        }
      }

      if( typeInvalid.length > 0 ){
        return CustomError.badRequestError(`Los siguientes tipos son inválidos: ${typeInvalid}`);
      }

      //3. Ajustamos los tags
      const getTagsFromRequest = updateProductDto.tags;
      const applySplitTags: string[] = getTagsFromRequest.split(',');

      let tagsValid: string[] = [];
      for (const iterTags of applySplitTags) {
        tagsValid.push(iterTags.toLowerCase());
      }

      //4. Ajustemos los colors
      const getColorsFromRequest = updateProductDto.colors;
      const applySplitColors: string[] = getColorsFromRequest.split(',');

      let colorsValid: string[] = [];
      for (const iterColor of applySplitColors) {
        colorsValid.push(iterColor.toLowerCase());
      }

      //Verificamos que no se repita el nombre que es Unique, lo haremos por el Slug generado
      const nameProduct = updateProductDto.title;
      let slug: string = nameProduct.toLowerCase();

      slug = slug.replace(/ñ/g, 'n'); // Reemplazar la Ñ y ñ por N y n
      slug = slug.replace(/\s+/g, '_'); // Reemplazar espacios por guiones bajos
      slug = slug.replace(/[^\w_]+/g, ''); // Eliminar todos los caracteres no alfanuméricos excepto guiones bajos
      slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Eliminar caracteres especiales (acentos y diacríticos)
      slug = slug.replace(/[^a-z0-9_]/g, ''); // Eliminar carácteres no permitido en URLs que no sean letras, números, o guiones bajos
      slug = slug.replace(/^_+/, ''); // Eliminar guiones bajos al inicio
      slug = slug.replace(/_+$/, ''); // Eliminar guiones bajos al final
      slug = slug.trim(); // Elimino espacios residuales al principio y al final

      const existProductByName = await this.prisma.tBL_PRODUCTS.findFirst({
        where: {
          OR: [
            { title: updateProductDto.title.trim().toUpperCase() },
            { slug }
          ]
        }
      });

      if( existProductByName ){
        if( existProductByName.id != id ){
          return CustomError.badRequestError(`Se esta intentando registrar un nombre de producto que ya se encuentra`);
        }
      }

      //Conversiones de booleanos requeridas (Cómo es form-data para evitar problemas)
      const isDiscountValue: boolean = ( updateProductDto.isDiscount == "true" ) ? true : false;
      const isFragileValue: boolean = ( updateProductDto.is_fragile == "true" ) ? true : false;

      //Actualizamos
      const updateProduct = await this.prisma.tBL_PRODUCTS.update({
        where: { id },
        data: {
          description: updateProductDto.description,
          inStock: updateProductDto.inStock,
          price: updateProductDto.price,
          sizes: JSON.stringify(sizeValid), //Se guardan arrays como Strings
          tags: JSON.stringify(tagsValid), //Se guardan arrays como Strings
          colors: JSON.stringify(colorsValid), //Se guardan arrays como Strings
          title: updateProductDto.title,
          slug,
          type: JSON.stringify(typeValid), //Se guardan arrays como Strings
          brand: updateProductDto.brand,
          isDiscount: isDiscountValue,
          percentDiscount: updateProductDto.percentDiscount,
          discountStartDate: updateProductDto.discountStartDate,
          discountEndDate: updateProductDto.discountEndDate,
          is_fragile: isFragileValue,
          views: 0,
          monthsWarranty: updateProductDto.monthsWarranty,
          status: true,
          category: {
            connect: {
              id: updateProductDto.categoryId, // Conexión con la categoría
            },
          },
          subCategory: {
            connect: {
              id: updateProductDto.subCategoryId, // Conexión con la subcategoría
            },
          },
          provider: {
            connect: {
              id: updateProductDto.providerId, // Conexión con el proveedor
            },
          },
          userUpdateAt: "123456789", //TODO: Pendiente del auth
          updateDateAt: new Date(),
        }
      });

      return updateProduct;
      
    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar actualizar el producto: ${error}`);
      return CustomError.badRequestError(`Error al intentar actualizar el producto`);
      
    } finally {
      
      this.logger.log(`Actualización de producto finalizada`);
      await this.prisma.$disconnect();

    }

  }

  async remove(id: number): Promise<ApiTransactionResponse<IProducts | string>> {

    try {
      
      //Verificamos que exista el ID solicitado
      const existProductById = await this.findOne(id);

      if( existProductById.data == null ){
        return new ApiTransactionResponse(
          null,
          EResponseCodes.FAIL,
          `No pudo ser encontrado un producto con el ID ${id}`
        );
      }

      //Llegamos hasta acá, actualizamos entonces:
      const updateProduct = await this.prisma.tBL_PRODUCTS.update({
        where: { id },
        data: {
          status: false,
          userUpdateAt: "123456789", //TODO -> Falta el tema de la auth.
          updateDateAt: new Date(),
        }
      });

      return new ApiTransactionResponse(
        updateProduct,
        EResponseCodes.OK,
        "Producto eliminado correctamente"
      );

    } catch (error) {

      this.logger.log(`Ocurrió un error al intentar eliminar lógicamente el producto: ${error}`);
      return new ApiTransactionResponse(
        error,
        EResponseCodes.FAIL,
        "Ocurrió un error al intentar eliminar lógicamente el producto"
      );
      
    } finally {
      
      this.logger.log(`Eliminación lógica de producto finalizada`);
      await this.prisma.$disconnect();

    }

  }

  //! CONSIDERACIONES:
  //* Los ID se podrían repetir, lo que no se puede repetir es un objeto idéntico (Variar por talla o color)
  //* La validación cruzada se hace por cada campo disponible
  //* Debemos considerar en la validación que la talla y el color deben de existir
  //* Debemos considerar que el producto se encuentre disponible
  async validateProducts(
    orderPurcharseValid: OrderPurchaseItemDto[]
  ): Promise<ApiTransactionResponse<IProducts[] | OrderPurchaseItemDto[] | string>> {

    const uniqueItemsSuccess = new Set<string>();
    let arrayObjectSuccess: IProducts[] = []; 
    let arrayObjectErrors: OrderPurchaseItemDto[] = [];
    let arrayObjectNoExistError: OrderPurchaseItemDto[] = [];

    for (const item of orderPurcharseValid){

      //? Validemos que exista primero el ID del producto:
      const getProduct = await this.prisma.tBL_PRODUCTS.findFirst({
        where: {
          AND: [
            { id: item.productId },
            { status: true },
            { sizes: { contains: `"${item.size}"` } }, // Verifica si el valor está en el array de sizes
            { colors: { contains: `"${item.color}"` } } // Verifica si el valor está en el array de colors
          ]
        },
        include: {
          category: true,
          subCategory: true,
          provider: true,
          TBL_IMAGES: true,
        }
      });

      if( getProduct ){

        //? Validamos que no se halle repetido con los elementos dados
        const itemIdentifier: string = `${item.productId}-${item.size}-${item.color}`;

        if (uniqueItemsSuccess.has(itemIdentifier)){

          arrayObjectErrors.push(item);

        }else{

          uniqueItemsSuccess.add(itemIdentifier);
          arrayObjectSuccess.push(getProduct);

        }

      }else{

        arrayObjectNoExistError.push(item);

      }

    } //forof de validación

    //? Validación de error si no se hallaron productos
    if( arrayObjectNoExistError.length > 0 ){
      
      return new ApiTransactionResponse(
        null,
        EResponseCodes.FAIL,
        "Hay productos que no fueron encontrados en base de datos (Considerando identificación, tallas y colores)."
      );

    }

    //? Validación de error si hay objetos repetidos
    if( arrayObjectErrors.length > 0 ){

      return new ApiTransactionResponse(
        null,
        EResponseCodes.FAIL,
        "Hay productos que se encuentran repetidos, corrija la información."
      );

    }

    return new ApiTransactionResponse(
      arrayObjectSuccess,
      EResponseCodes.OK,
      "Productos filtrados de manera adecuada."
    );


  }

  async getProductsByArrayIds(
    ids: number[]
  ): Promise<ApiTransactionResponse<IProducts[] | string>> {

    ids = Array.from(new Set(ids));

    const getProducts = await this.prisma.tBL_PRODUCTS.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    if ( getProducts.length !== ids.length ) {
      return new ApiTransactionResponse(
        null,
        EResponseCodes.FAIL,
        "Algunos productos no fueron encontrados."
      );
    }


    return new ApiTransactionResponse(
      getProducts,
      EResponseCodes.OK,
      "Productos filtrados de manera adecuada."
    );

  }

}
