import { Transform } from "class-transformer";
import { IsBoolean,
         IsEnum,
         IsNotEmpty,
         IsNumber,
         IsOptional,
         IsPositive } from "class-validator";
import { OrderStatus, OrderStatusList } from "../../../constants/OrderEnum";


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

    @IsEnum(OrderStatusList, { message: `Los estados permisitos son ${OrderStatusList}` })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDIENTE;

    @IsBoolean()
    @IsOptional()
    paid: boolean = false;

}
