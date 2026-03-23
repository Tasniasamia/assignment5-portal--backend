export class AppError extends Error{
    public statusCode:number=500;
    constructor(statusCode:number,message:string,stack?:string){
        super(message);

        this.statusCode=statusCode;

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    
    }
}