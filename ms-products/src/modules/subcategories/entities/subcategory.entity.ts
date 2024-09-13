import { Category } from "../../../modules/categories/entities/category.entity";

export class Subcategory {

    public id: number;
    public name: string;
    public url: string;
    public description: string;

    public categoryId: Category | number;

    public userCreateAt?: string;
    public createDateAt?: Date;
    public userUpdateAt?: string;
    public updateDateAt?: Date;

}
