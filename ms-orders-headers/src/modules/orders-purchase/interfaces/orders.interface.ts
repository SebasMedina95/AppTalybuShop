import { OrderStatus } from "@prisma/client";

export interface IOrders {
    id?: number;
    factureCode?: string;
    totalAmount?: number;
    totalItems?: number;
    status?: OrderStatus;
    paid?: boolean;
    paidAt?: Date;
    description?: string;
    //items: IItemsOrders[];
    
    userCreateAt?: string;
    createDateAt?: Date;
    userUpdateAt?: string;
    updateDateAt?: Date;
    
}

interface IItemsOrders {
    productId: number;
    quantity: number;
    price: number;
    percentDiscount: number;
}
