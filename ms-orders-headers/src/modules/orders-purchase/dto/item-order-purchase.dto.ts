import { Transform } from "class-transformer";
import { 
    IsNotEmpty, 
    IsNumber, 
    IsPositive, 
    IsString
} from "class-validator";

export class OrderPurchaseItemDto {

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El ID del producto debe ser numérico" })
    @IsNotEmpty({ message: "El ID del producto es un campo requerido" })
    @IsPositive({ message: "Solo se permiten valores positivos" })
    productId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "La cantidad de elementos del producto debe ser numérico" })
    @IsNotEmpty({ message: "La cantidad de elementos del producto es un campo requerido" })
    @IsPositive({ message: "Solo se permiten valores positivos" })
    quantity: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El precio del producto debe ser numérico" })
    @IsNotEmpty({ message: "El precio del producto es un campo requerido" })
    @IsPositive({ message: "Solo se permiten valores positivos" })
    price: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El porcentaje de descuento del producto debe ser numérico" })
    @IsNotEmpty({ message: "El porcentaje de descuento del producto es un campo requerido" })
    percentDiscount: number;

    @IsString()
    @IsNotEmpty({ message: "El tamaño del producto es un campo requerido" })
    size: string;

    @IsString()
    @IsNotEmpty({ message: "El color del producto es un campo requerido" })
    color: string;

}
