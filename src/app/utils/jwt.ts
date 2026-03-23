import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import type { IJwtUserPayload } from '../interfaces/token.interface';

const createToken=(payload:JwtPayload,jwtSecret:string,options:SignOptions)=>{
    return  jwt.sign(payload, jwtSecret, options);
}

const verifyToken=(token:string,jwtSecret:string)=>{
  
    try{
        const decoded= jwt.verify(token, jwtSecret);
        return {success:true,data:decoded};
    }
    catch(error:any){
        return {
            success:false,
            message:error?.message

        }
    }
}

const decodeToken=(token:string)=>{
    return jwt.decode(token);
}



export const jwtUtils={createToken,verifyToken,decodeToken}




