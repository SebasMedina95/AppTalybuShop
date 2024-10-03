import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    STAGE: string;
    DATABASE_URL: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    DB_HOST: string;
    DB_TYPE: string;
    PRODUCTS_MS_HOST: string;
    PRODUCTS_MS_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    STAGE: joi.string().optional(),
    DATABASE_URL: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_TYPE: joi.string().required(),
    PRODUCTS_MS_HOST: joi.string().required(),
    PRODUCTS_MS_PORT: joi.number().required(),
}).unknown(true);

const { error, value } = envsSchema.validate( process.env )

if( error ){
    throw new Error(`Error en la validación de la configuración. Error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT, 
    STAGE: envVars.STAGE, 
    DATABASE_URL: envVars.DATABASE_URL, 
    DB_USER: envVars.DB_USER, 
    DB_NAME: envVars.DB_NAME, 
    DB_PASSWORD: envVars.DB_PASSWORD, 
    DB_PORT: envVars.DB_PORT, 
    DB_HOST: envVars.DB_HOST, 
    DB_TYPE: envVars.DB_TYPE,
    PRODUCTS_MS_HOST: envVars.PRODUCTS_MS_HOST,
    PRODUCTS_MS_PORT: envVars.PRODUCTS_MS_PORT,
}
