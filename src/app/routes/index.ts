import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { categoryRoutes } from "../modules/idea/category/category.route";
import { ideaRoutes } from "../modules/idea/idea.route";
import { globalRoutes } from "../modules/global/global.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { commentRoutes } from "../modules/comment/comment.route";



const route=Router();

const allRoutes=[
 
    {
        path:'/auth',
        handler:AuthRoutes
    },
    {
        path:'/user',
        handler:userRoutes
    },
    {
        path:'/idea/category',
        handler:categoryRoutes
    },
    {
        path:'/idea',
        handler:ideaRoutes
    },
    {
        path:'/delete',
        handler:globalRoutes
    },
    {
        path:'/payments',
        handler:paymentRoutes
    },
    {
        path:'/comments',
        handler:commentRoutes
    }

]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;