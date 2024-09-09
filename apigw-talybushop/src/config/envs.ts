import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    PRODUCTS_MS_HOST: string;
    PRODUCTS_MS_PORT: number;
    ORDERS_HEADER_MS_HOST: string;
    ORDERS_HEADER_MS_PORT: number;
    ORDERS_DETAILS_MS_HOST: string;
    ORDERS_DETAILS_MS_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
    ORDERS_HEADER_MS_HOST: joi.string().required(),
    ORDERS_HEADER_MS_PORT: joi.number().required(),
    ORDERS_DETAILS_MS_HOST: joi.string().required(),
    ORDERS_DETAILS_MS_PORT: joi.number().required()
}).unknown(true);

const { error, value } = envsSchema.validate( process.env )

if( error ){
    throw new Error(`Error en la validación de la configuración. Error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    PRODUCTS_MS_HOST: envVars.PRODUCTS_MS_HOST,
    PRODUCTS_MS_PORT: envVars.PRODUCTS_MS_PORT,
    ORDERS_HEADER_MS_HOST: envVars.ORDERS_HEADER_MS_HOST,
    ORDERS_HEADER_MS_PORT: envVars.ORDERS_HEADER_MS_PORT,
    ORDERS_DETAILS_MS_HOST: envVars.ORDERS_DETAILS_MS_HOST,
    ORDERS_DETAILS_MS_PORT: envVars.ORDERS_DETAILS_MS_PORT
}