import { OrderStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean,
         IsEnum,
         IsNotEmpty,
         IsNumber,
         IsOptional,
         IsPositive, 
         IsString,
         MaxLength} from "class-validator";
import { OrderStatusList } from "../../../constants/OrderEnum";

export class CreateOrdersPurchaseDto {

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "El total de la compra debe ser numérico" })
    @IsNotEmpty({ message: "El total de la compra es un campo requerido" })
    @IsPositive({ message: "Solo se permiten valores positivos" })
    totalAmount: number;

    @Transform(({ value }) => Number(value))
    @IsNumber({}, { message: "La cantidad de elementos de la compra debe ser numérico" })
    @IsNotEmpty({ message: "La cantidad de elementos de la compra es un campo requerido" })
    @IsPositive({ message: "Solo se permiten valores positivos" })
    totalItems: number;

    @IsString({ message: "La descripción de la orden de pago debe ser un String válido" })
    @MaxLength(5000, { message: "La descripción de la orden de pago además de requerida no debe sobre pasar los 5000 caracteres" })
    @IsOptional()
    public description: string;

    @IsEnum(OrderStatusList, { message: `Los estados permitidos son ${OrderStatusList}` })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDIENTE;

    @IsBoolean()
    @IsOptional()
    paid: boolean = false;

}
