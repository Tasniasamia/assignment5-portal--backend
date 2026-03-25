import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { categoryRoutes } from "../modules/idea/category/category.route";
import { ideaRoutes } from "../modules/idea/idea.route";
import { globalRoutes } from "../modules/global/global.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { commentRoutes } from "../modules/comment/comment.route";
import { voteRoutes } from "../modules/vote/vote.route";
import { dashboardRoutes } from "../modules/dashboard/dashboard.route";



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
    },
    {
        path:'/votes',
        handler:voteRoutes
    },
    {
        path:'/dashboard',
        handler:dashboardRoutes
    }

]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;