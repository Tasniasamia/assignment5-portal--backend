import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";



const route=Router();

const allRoutes=[
 
    {
        path:'/auth',
        handler:AuthRoutes
    },
    {
        path:'/user',
        handler:userRoutes
    }

]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;