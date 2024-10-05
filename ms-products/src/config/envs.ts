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
    CLOUDINARY_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    NATS_SERVERS: string[];
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
    CLOUDINARY_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
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
    STAGE: envVars.STAGE, 
    DATABASE_URL: envVars.DATABASE_URL, 
    DB_USER: envVars.DB_USER, 
    DB_NAME: envVars.DB_NAME, 
    DB_PASSWORD: envVars.DB_PASSWORD, 
    DB_PORT: envVars.DB_PORT, 
    DB_HOST: envVars.DB_HOST, 
    DB_TYPE: envVars.DB_TYPE, 
    CLOUDINARY_NAME: envVars.CLOUDINARY_NAME, 
    CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY, 
    CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
    NATS_SERVERS: envVars.NATS_SERVERS,
}
