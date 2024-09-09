import { UploadApiErrorResponse, 
    UploadApiResponse } from 'cloudinary'

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse

//Aquí es donde cloudinary devuelve la promesa