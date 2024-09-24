import { Product } from "./product.entity";

export class Image {

    public id?: number;
    public url: string;
    public product?: Product | number;

    public userCreateAt?: string;
    public createDateAt?: Date;

}