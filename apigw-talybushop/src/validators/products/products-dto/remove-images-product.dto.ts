import { 
     IsNotEmpty,
     IsNumber,
     IsString,
     MaxLength,
     MinLength 
} from "class-validator";

export class RemoveImagesProductDto {

    @IsNumber({}, {message: "El id del producto es requerido"})
    @IsNotEmpty({ message: "El id del producto es un campo requerido" })
    public productId: number;

    @IsString({ message: "Los ID de eliminación deben ser un String válido" })
    @MinLength(1, { message: "Los ID de eliminación deben ser, además de requeridos, tener al menos 1 caracter" })
    @MaxLength(500, { message: "Los ID de eliminación deben ser, además de requeridos, no deben sobrepasar los 500 caracteres" })
    @IsNotEmpty({ message: "Los ID de eliminación son un campo requerido" })
    public imagesIdDelete: string;

}
