import { Category } from "../../../modules/categories/entities/category.entity";
import { Provider } from "../../../modules/providers/entities/provider.entity";
import { Subcategory } from "../../../modules/subcategories/entities/subcategory.entity";
import { ValidSizes, ValidTypes } from "../../../types/product.type";

export class Product {

    public id?: number;
    public description: string;
    public inStock: number;
    public price: number;
    public sizes: ValidSizes[];
    public slug?: string;
    public tags: string[];
    public colors: string[];
    public title: string;
    public type: ValidTypes;
    
    public brand: string;
    public isDiscount: boolean;
    public percentDiscount: number;
    public discountStartDate: Date;
    public discountEndDate: Date;
    public is_fragile: boolean;
    public views: number;
    public monthsWarranty: number;

    public categoryId: Category | number;
    public subCategoryId: Subcategory | number;
    public providerId: Provider | number;

    public userCreateAt?: string;
    public createDateAt?: Date;
    public userUpdateAt?: string;
    public updateDateAt?: Date;

}
