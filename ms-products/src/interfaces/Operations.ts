import { EResponseCodes } from '../constants/ResponseCodesEnum';

export interface IOperation {
    code: EResponseCodes;
    message?: string;
}