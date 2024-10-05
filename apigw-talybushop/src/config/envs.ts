import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    // PRODUCTS_MS_HOST: string;
    // PRODUCTS_MS_PORT: number;
    // ORDERS_HEADER_MS_HOST: string;
    // ORDERS_HEADER_MS_PORT: number;
    // ORDERS_DETAILS_MS_HOST: string;
    // ORDERS_DETAILS_MS_PORT: number;
    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    // PRODUCTS_MS_HOST: joi.string().required(),
    // PRODUCTS_MS_PORT: joi.number().required(),
    // ORDERS_HEADER_MS_HOST: joi.string().required(),
    // ORDERS_HEADER_MS_PORT: joi.number().required(),
    // ORDERS_DETAILS_MS_HOST: joi.string().required(),
    // ORDERS_DETAILS_MS_PORT: joi.number().required()
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(",")
})

if( error ){
    throw new Error(`Error en la validación de la configuración. Error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    // PRODUCTS_MS_HOST: envVars.PRODUCTS_MS_HOST,
    // PRODUCTS_MS_PORT: envVars.PRODUCTS_MS_PORT,
    // ORDERS_HEADER_MS_HOST: envVars.ORDERS_HEADER_MS_HOST,
    // ORDERS_HEADER_MS_PORT: envVars.ORDERS_HEADER_MS_PORT,
    // ORDERS_DETAILS_MS_HOST: envVars.ORDERS_DETAILS_MS_HOST,
    // ORDERS_DETAILS_MS_PORT: envVars.ORDERS_DETAILS_MS_PORT
    NATS_SERVERS: envVars.NATS_SERVERS,
}