import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PageOptionsDto } from '../../helpers/paginations/dto/page-options.dto';
import { PageDto } from '../../helpers/paginations/dto/page.dto';

import { MySqlErrorsExceptions } from '../../helpers/errors/exceptions-sql';
import { CustomError } from '../../helpers/errors/custom.error';

import { IImagesSimpleTable, IProducts } from './interfaces/products.interface';
import { ValidSizesArray, ValidTypesArray } from '../../types/product.type';
import { PageMetaDto } from 'src/helpers/paginations/dto/page-meta.dto';
import { ApiTransactionResponse } from 'src/util/ApiResponse';
import { EResponseCodes } from 'src/constants/ResponseCodesEnum';

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

    //* 8. Guardamos (Solo el producto sin imágenes aún).
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
        isDiscount: createProductDto.isDiscount,
        percentDiscount: createProductDto.percentDiscount,
        discountStartDate: createProductDto.discountStartDate,
        discountEndDate: createProductDto.discountEndDate,
        is_fragile: createProductDto.is_fragile,
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
            provider: true
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
