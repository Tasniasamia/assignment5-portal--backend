import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  PORT: string;
  NODE_ENV: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRESIN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRESIN: string;
  BETTER_AUTH_SESSION_TOKEN_SECRET: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIREIN:string,
  BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE:string,
  EMAIL_SENDER_SMTP_USER:string,
  EMAIL_SENDER_SMTP_PASS:string,
  EMAIL_SENDER_SMTP_HOST:string,
  EMAIL_SENDER_SMTP_PORT:string,
  CLIENT_ID:string,
  CLIENT_SECRET:string,
  CALLBACK_URL:string,
  FRONTEND_URL:string,
  CLOUDINARY_CLOUD_NAME:string,
  CLOUDINARY_API_KEY:string,
  CLOUDINARY_API_SECRET:string,
  STRIPE_PUBLISHABLE_KEY:string,
  STRIPE_SECRET_KEY:string,
  WEBHOOK_SIGNING_SECRET:string


}

const loadEnvironmentVariables = (): EnvConfig => {
  [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "PORT",
    "NODE_ENV",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRESIN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRESIN",
    "BETTER_AUTH_SESSION_TOKEN_SECRET",
    "BETTER_AUTH_SESSION_TOKEN_EXPIREIN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_PASS",
    "CLIENT_ID",
    "CLIENT_SECRET",
    "CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "WEBHOOK_SIGNING_SECRET"

  ].forEach((variable) => {
    if (!process?.env?.[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file`
      );
    }
  });
  return {
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRESIN: process.env.ACCESS_TOKEN_EXPIRESIN as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_EXPIRESIN: process.env.REFRESH_TOKEN_EXPIRESIN as string,
    BETTER_AUTH_SESSION_TOKEN_SECRET: process.env.BETTER_AUTH_SESSION_TOKEN_SECRET as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIREIN:process.env.BETTER_AUTH_SESSION_TOKEN_EXPIREIN as string,
    BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE:process.env.BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE as string,
    EMAIL_SENDER_SMTP_USER:process.env.EMAIL_SENDER_SMTP_USER as string,
    EMAIL_SENDER_SMTP_PASS:process.env.EMAIL_SENDER_SMTP_PASS as string,
    EMAIL_SENDER_SMTP_HOST:process.env.EMAIL_SENDER_SMTP_HOST as string,
    EMAIL_SENDER_SMTP_PORT:process.env.EMAIL_SENDER_SMTP_PORT as string,
    CLIENT_ID:process.env.CLIENT_ID as string,
    CLIENT_SECRET:process.env.CLIENT_SECRET as string,
    CALLBACK_URL:process.env.CALLBACK_URL as string,
    FRONTEND_URL:process.env.FRONTEND_URL as string,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET as string,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME as string,
    STRIPE_PUBLISHABLE_KEY:process.env.STRIPE_PUBLISHABLE_KEY as string,
  STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY as string,
  WEBHOOK_SIGNING_SECRET:process.env.WEBHOOK_SIGNING_SECRET as string

  };
};

export const envVars: EnvConfig = loadEnvironmentVariables();


// "dev": "npx tsx watch --env-file .env --watch  src/server.ts",
