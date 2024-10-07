import { IsBoolean, IsDate, IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength } from "class-validator";
import { Transform } from "class-transformer";
export class CreateProductDto {

    @IsString({ message: "La descripción debe ser un String válido" })
    @MinLength(1, { message: "La descripción además de requerida debe tener al menos 1 caracter" })
    @MaxLength(5000, { message: "La descripción además de requerida no debe sobre pasar los 5000 caracteres" })
    @IsNotEmpty({ message: "La descripción es un campo requerido" })
    public description: string;

    @IsNumber({}, {message: "La cantidad en Stock no debe ser negativa"})
    @Min(0)
    @IsNotEmpty({ message: "La cantidad en Stock es un campo requerido" })
    public inStock: number;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "El precio debe ser numérico y máximo con 2 decimales" })
    @IsPositive()
    @Min(0)
    @IsNotEmpty({ message: "El precio es un campo requerido" })
    public price: number;

    @IsString({ message: "Las tallas debe ser un String válido []" })
    @IsNotEmpty({ message: "Las tallas son un campo requerido" })
    public sizes: string;

    @IsString({ message: "Los tags debe ser un String válido []" })
    @IsNotEmpty({ message: "Los tags del producto es un campo requerido" })
    public tags: string;

    @IsString({ message: "Los colores debe ser un String válido []" })
    @IsNotEmpty({ message: "Los colores del producto es un campo requerido" })
    public colors: string;

    @IsString({ message: "El nombre del producto debe ser un String válido" })
    @MinLength(1, { message: "El nombre del producto además de requerida debe tener al menos 1 caracter" })
    @MaxLength(500, { message: "El nombre del producto además de requerida no debe sobre pasar los 500 caracteres" })
    @IsNotEmpty({ message: "El nombre del producto es un campo requerido" })
    public title: string;

    @IsString({ message: "El tipo deben ser un array de String válida" })
    @MinLength(1, { message: "El tipo además de requerida debe tener al menos 1 caracter" })
    @MaxLength(50, { message: "El tipo además de requerida no debe sobre pasar los 50 caracteres" })
    @IsNotEmpty({ message: "El tipo es un campo requerido" })
    public type: string;

    @IsString({ message: "La marca debe ser un String válido" })
    @MinLength(1, { message: "La marca además de requerida debe tener al menos 1 caracter" })
    @MaxLength(100, { message: "La marca además de requerida no debe sobre pasar los 100 caracteres" })
    @IsNotEmpty({ message: "La marca es un campo requerido" })
    public brand: string;

    @IsString({ message: "Tiene descuento debe ser un boolean valido" })
    @IsNotEmpty({ message: "Tiene descuento es un campo requerido" })
    public isDiscount: string; //Como trabajamos form-data, mejor enviarlo como String y lo convertimos programaticamente

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Porcentaje de descuento debe ser numérico" })
    @Min(0)
    @IsNotEmpty({ message: "El Porcentaje de descuento es un campo requerido" })
    public percentDiscount: number;

    @IsDate({ message: "El inicio de la fecha de descuento debe ser una fecha valida" })
    @IsNotEmpty({ message: "El inicio de la fecha es un campo requerido" })
    public discountStartDate: Date;

    @IsDate({ message: "El fin de la fecha de descuento debe ser una fecha valida" })
    @IsNotEmpty({ message: "El fin de la fecha es un campo requerido" })
    public discountEndDate: Date;

    @IsString({ message: "Es frágil debe ser un boolean valido" })
    @IsNotEmpty({ message: "Es frágil es un campo requerido" })
    public is_fragile: string; //Como trabajamos form-data, mejor enviarlo como String y lo convertimos programaticamente

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "Meses de garantía debe ser numérico" })
    @IsPositive()
    @Min(0)
    @IsNotEmpty({ message: "Los meses de garantía es un campo requerido" })
    public monthsWarranty: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El id de la categoría debe ser numérico" })
    @IsNotEmpty({ message: "El id de la categoría es un campo requerido" })
    public categoryId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El id de la sub categoría debe ser numérico" })
    @IsNotEmpty({ message: "El id de la sub categoría es un campo requerido" })
    public subCategoryId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El id del proveedor debe ser numérico" })
    @IsNotEmpty({ message: "El id del proveedor es un campo requerido" })
    public providerId: number;

    //Para procesar las imagenes, ya que tequerimos 2 tipos de Payload, entonces para agrupar
    //Como al enviarlo por el Microservicio podríamos tener problemas, dejamos el tipado general
    //en el Gateway, y acá lo recibimos como any PERO lo re convertimos para usarlo
    @IsOptional()
    public imagesProducts?: any;

}
