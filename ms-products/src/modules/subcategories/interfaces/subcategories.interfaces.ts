import { ICategory } from "src/modules/categories/interfaces/categories.interface";

export interface ISubCategory {
    id?: number;
    name: string;
    url: string;
    description: string;
    category: ICategory;
    categoryId: number;

    userCreateAt?: string;
    createDateAt?: Date;
    userUpdateAt?: string;
    updateDateAt?: Date;
}