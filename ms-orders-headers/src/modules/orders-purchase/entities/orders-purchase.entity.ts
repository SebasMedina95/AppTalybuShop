import { OrderStatus } from "@prisma/client";

export class OrdersPurchase {

    public id?: number;
    public factureCode: string;
    public totalAmount: number;
    public totalItems: number;
    public status: OrderStatus;
    public paid: boolean;
    public paidAt: Date;
    public description: string;
    public createAt: Date;
    public updateAt: Date;

}
