import { Transform } from "class-transformer";
import { IsNotEmpty,
         IsNumber,
         IsOptional,
         IsString,
         MaxLength,
         MinLength } from "class-validator";

export class CreateSubCategoryDto {

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El id de la categoría debe ser numérico" })
    @IsNotEmpty({ message: "El id de la categoría es un campo requerido" })
    public categoryId: number;

    @IsString({ message: "El nombre la sub categoría debe ser un String válido" })
    @MinLength(1, { message: "El nombre la sub categoría además de requerida debe tener al menos 1 caracter" })
    @MaxLength(100, { message: "El nombre la sub categoría además de requerida no debe sobre pasar los 500 caracteres" })
    @IsNotEmpty({ message: "El nombre la sub categoría es un campo requerido" })
    @Transform(({ value }) => value.trim().toUpperCase())
    public name: string;

    @IsString({ message: "El nombre la sub categoría debe ser un String válido" })
    @MaxLength(5000, { message: "El nombre la sub categoría además de requerida no debe sobre pasar los 5000 caracteres" })
    @IsOptional()
    public description: string;

}
