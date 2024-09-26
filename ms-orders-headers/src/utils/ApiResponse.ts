import { IOperation } from '../interfaces/Operations';
import { EResponseCodes } from '../constants/ResponseCodesEnum';

interface IDataPaging {
    total: number;
    perPage?: number;
    currentPage?: number;
    lastPage?: number;
    firstPage?: number;
    firstPageUrl?: string;
    lastPageUrl?: string;
    nextPageUrl?: string;
    previousPageUrl?: string;
}

export interface IPagingData<T> {
    array: T[];
    meta: IDataPaging;
}

export class ApiTransactionResponse<T> {
    data: T;
    operation: IOperation;

    constructor(data: T, code: EResponseCodes, message?: string) {
        this.data = data;
        this.operation = { code, message };
    }
}