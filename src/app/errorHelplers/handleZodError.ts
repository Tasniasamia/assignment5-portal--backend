import status from "http-status";
import z from "zod";
import type { TErrorResponse, TErrorSources } from "../interfaces/error.interface";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod Validation Error";
    let errorSources: TErrorSources[] = [];

    errorSources=  err?.issues?.map((error)=>{
        return {
            path:error.path.join('=>'),
            message:error?.message
        }
    })

    return {
        success: false,
        message,
        errorSources,
        statusCode
    }
}