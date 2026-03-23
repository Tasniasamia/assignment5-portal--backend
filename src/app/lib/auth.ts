import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVars } from "../../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { Role, UserStatus } from "../../generated/prisma/enums";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // baseURL: envVars.BETTER_AUTH_URL, 
  // secret:envVars.BETTER_AUTH_SECRET,
  

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
    //   sendVerificationEmail: async ( { user, url, token }, request) => {

    // },
  },
 session: {
  expiresIn: 60 * 60 * 24,   // = 86400 seconds
  updateAge: 60 * 60 * 24,
  cookieCache: {
    maxAge: 60 * 60 * 24,
  }
},
  socialProviders: {
      google: { 
          clientId: envVars.CLIENT_ID as string, 
          clientSecret: envVars.CLIENT_SECRET as string, 
          mapProfileToUser:()=>{
            return {
              emailVerified:true,
              role :Role.MEMBER,
              status:UserStatus.ACTIVE,
              needPasswordChanges:false,
              isDeleted:false,
            }
          }
      }, 
  },


  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.MEMBER,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },

      needPasswordChanges: {
        type: "boolean",
        defaultValue: false,
      },

      isDeleted: {
        type: "boolean",
        defaultValue: false,
      },

      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },



  
  plugins: [
    bearer(),
    emailOTP({
      // overrideDefaultEmailVerification: true, 
      // async sendVerificationOTP({ email, otp, type }) {
      //   const user=await prisma.user.findUnique({where:{email:email}});
        
      //   if (!user) return ;
      //   if (type === "email-verification") {
      //     if(user && !user?.emailVerified){
      //       await  sendEmail({
      //         to: email,
      //         subject: "Email Verification",
      //         templateName: "emailVerification",
      //         templateData: { email:email, otp:otp },
      //       });
      //     }
          
        

      //   } else if(type === "forget-password") {
      //     if(user && (user?.status === UserStatus.ACTIVE) && !(user?.isDeleted)){
      //       await  sendEmail({
      //         to: email,
      //         subject: "Reset Password",
      //         templateName: "emailVerification",
      //         templateData: { email:email, otp:otp },
      //       });
      //     }
       
      //   }
       
      // },
      // otpLength: 6,
      // expiresIn: 60*2

 overrideDefaultEmailVerification: true,
  async sendVerificationOTP({ email, otp, type }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    // ✅ Last OTP এর পর ২ মিনিট হয়েছে কিনা check
    const lastSent = await prisma.otpLog.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    if (lastSent) {
      const diff = (now.getTime() - lastSent.createdAt.getTime()) / 1000;
      if (diff < 120) {
        throw new Error(`Please wait ${Math.ceil(120 - diff)} seconds before resending`);
      }
    }

    // ✅ Log save করো
    await prisma.otpLog.create({ data: { email } });

    if (type === "email-verification" && !user.emailVerified) {
      await sendEmail({
        to: email,
        subject: "Email Verification",
        templateName: "emailVerification",
        templateData: { email, otp },
      });
    } else if (type === "forget-password") {
      await sendEmail({
        to: email,
        subject: "Reset Password",
        templateName: "emailVerification",
        templateData: { email, otp },
      });
    }
  },
  otpLength: 6,
  expiresIn: 60 * 2,




    }),
  ],



  advanced:{
    useSecureCookies:false,
    cookies:{
      state:{
        attributes:{
          sameSite:'none',
          httpOnly:true,
          secure:true,
          path:'/'
        }
      },
      sessionToken:{
        attributes:{
          sameSite:'none',
          httpOnly:true,
          secure:true,
          path:'/'
        }
      }
    }
  }
});
