import { Transform } from "class-transformer";
import { IsEmail,
         IsNotEmpty,
         IsNumber,
         IsOptional,
         IsString,
         MaxLength,
         MinLength } from "class-validator";

export class CreateProviderDto {

    @IsString({ message: "El nombre del proveedor debe ser un String válido" })
    @MinLength(1, { message: "El nombre del proveedor además de requerida debe tener al menos 1 caracter" })
    @MaxLength(100, { message: "El nombre del proveedor además de requerida no debe sobre pasar los 100 caracteres" })
    @IsNotEmpty({ message: "El nombre del proveedor es un campo requerido" })
    @Transform(({ value }) => value.trim().toUpperCase())
    public name: string;

    @IsString({ message: "El nombre del proveedor debe ser un String válido" })
    @MaxLength(200, { message: "El nombre del proveedor además de requerida no debe sobre pasar los 200 caracteres" })
    @IsOptional()
    public address?: string;

    @IsString({ message: "El número de teléfono 1 del proveedor debe ser un String válido" })
    @MaxLength(40, { message: "El número de teléfono 1 del proveedor además de requerida no debe sobre pasar los 40 caracteres" })
    public phone1: string;

    // @IsNumber({}, { message: "El número de teléfono 2 del proveedor debe ser un Number válido" })
    // @MaxLength(40, { message: "El número de teléfono 2 del proveedor además de requerida no debe sobre pasar los 40 caracteres" })
    @IsOptional()
    public phone2?: string | null;

    @IsEmail({}, { message: "El email 1 del proveedor debe ser un String válido" })
    @MaxLength(150, { message: "El email 1 del proveedor además de requerida no debe sobre pasar los 150 caracteres" })
    public email1: string;

    // @IsEmail({}, { message: "El email 2 del proveedor debe ser un String válido" })
    // @MaxLength(150, { message: "El email 2 del proveedor además de requerida no debe sobre pasar los 150 caracteres" })
    @IsOptional()
    public email2?: string | null;

    //@IsString({ message: "La descripción del proveedor debe ser un String válido" })
    @MaxLength(5000, { message: "La descripción del proveedor además de requerida no debe sobre pasar los 500 caracteres" })
    @IsOptional()
    public description?: string;

}
