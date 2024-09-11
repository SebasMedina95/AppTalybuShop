export interface ICategory {
    id?: number;
    name: string;
    url: string;
    tags: string;
    description: string;

    userCreateAt?: string;
    createDateAt?: Date;
    userUpdateAt?: string;
    updateDateAt?: Date;
}