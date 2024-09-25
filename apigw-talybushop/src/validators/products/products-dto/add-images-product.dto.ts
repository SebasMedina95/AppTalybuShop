import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AddImagesProductDto {

    @IsNumber({}, {message: "El id del producto es requerido"})
    @IsNotEmpty({ message: "El id del producto es un campo requerido" })
    public productId: number;

    //Para procesar las imagenes, ya que tequerimos 2 tipos de Payload, entonces para agrupar
    //Como al enviarlo por el Microservicio podríamos tener problemas, dejamos el tipado general
    //en el Gateway, y acá lo recibimos como any PERO lo re convertimos para usarlo
    @IsOptional()
    public imagesProducts?: any;

}
