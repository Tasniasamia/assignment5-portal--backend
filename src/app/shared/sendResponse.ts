import type { Response } from "express"
export interface TSendResponse<T,M>{
    httpStatusCode:number,
    success:boolean,
    message:string,
    data?:T,
    meta?:M
}
export const sendResponse=async<T,M>(res:Response,responseData:TSendResponse<T,M>)=>{
    const {httpStatusCode,...responses}= responseData;
    return res.status(httpStatusCode).json(
        responses
    )
}