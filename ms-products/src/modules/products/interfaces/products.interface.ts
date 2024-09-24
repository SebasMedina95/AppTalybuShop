import { Category } from "../../categories/entities/category.entity";
import { Subcategory } from "../../subcategories/entities/subcategory.entity";
import { Provider } from "../../providers/entities/provider.entity";

export interface IImages {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export interface IErrorImages {
    error: string;
    fileError: IImages | string;
}

export interface IImagesSimpleTable {
    id?: number;
    url: string;
    productId?: number;
}

export interface IProducts {
    id?: number;
    description: string;
    inStock: number;
    price: number;
    sizes: string;
    slug?: string;
    tags: string;
    colors: string;
    title: string;
    type: string;

    brand: string;
    isDiscount: boolean;
    percentDiscount: number;
    discountStartDate: Date;
    discountEndDate: Date;
    is_fragile: boolean;
    views: number;
    monthsWarranty: number;

    categoryId?: number;
    subCategoryId?: number;
    providerId?: number;

    category?: Category;
    subCategory?: Subcategory;
    provider?: Provider;
    images?: IImagesSimpleTable[];

    userCreateAt?: string;
    createDateAt?: Date;
    userUpdateAt?: string;
    updateDateAt?: Date;
}