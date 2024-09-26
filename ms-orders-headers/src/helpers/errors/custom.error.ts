export class CustomError extends Error {

    private constructor(
        public readonly statusCode: number,
        public readonly message: string
    ){
        super(message);
    }

    static badRequestError( message: string ){
        return new CustomError(400, message);
    }

    static unAuthorizedError( message: string ){
        return new CustomError(401, message);
    }

    static forbbidenError( message: string ){
        return new CustomError(403, message);
    }

    static notFoundError( message: string ){
        return new CustomError(404, message);
    }

    static internalServerError( message: string ){
        return new CustomError(500, message);
    }

}