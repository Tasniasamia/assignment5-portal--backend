


import { prisma } from "../app/lib/prisma";
import { Role } from "../generated/prisma/enums";

(async()=>{
try{
  const adminInfo={
    name:"Admin",
    email:"admin@gmail.com",
    password:"Admin123456",
};
const existUser=await prisma.user.findUnique({where:{email:adminInfo.email}});
if(existUser){
 throw new Error("User already exist");
}
const response=await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin":"https://assignment5-frontend-theta.vercel.app"
   
    },
    body: JSON.stringify(adminInfo),
  });
  console.log("response",response);
if(response?.ok){
    const data = await prisma.user.update({
        where: {
          email: adminInfo.email,
        },
        data: {
            emailVerified: true,
            role:Role.ADMIN

        },
      });

      }

}
catch(error:any){
    console.error(error?.message);
}
})();