import { Type } from "class-transformer";
import { 
    ArrayMinSize, 
    IsArray,
    IsOptional,
    ValidateNested
} from "class-validator";
import { OrderPurchaseItemDto } from "./item-order-purchase.dto";

export class CreateOrdersPurchaseDto {

    @IsArray({ message: "Debe ser un arreglo válido" })
    @ArrayMinSize(1, {message: "La orden debe tener como mínimo un elemento"})
    @ValidateNested({ each: true }) //Validación interna de los items
    @Type( () => OrderPurchaseItemDto )
    items: OrderPurchaseItemDto[];

    @IsOptional()
    description: string;

}
