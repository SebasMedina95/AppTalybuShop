
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

    userCreateAt?: string;
    createDateAt?: Date;
    userUpdateAt?: string;
    updateDateAt?: Date;
}