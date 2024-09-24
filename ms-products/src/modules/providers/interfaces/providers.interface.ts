
export interface IProvider {

    id?: number;
    name: string;
    status: boolean;
    address?: string;
    phone1?: string;
    phone2?: string;
    email1?: string;
    email2?: string;
    description?: string;

    userCreateAt?: string;
    createDateAt?: Date;
    userUpdateAt?: string;
    updateDateAt?: Date;

}
