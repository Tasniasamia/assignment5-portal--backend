import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import route from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { NotfoundHandler } from "./app/middleware/notFoundHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cron from "node-cron";
import { paymentController } from "./app/modules/payment/payment.controller";
// import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhookEvent
);
// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// CORS
const allowedOrigins = [
  process.env.APP_URL,
  process.env.PROD_APP_URL,
  "https://assignment5-frontend-theta.vercel.app",
  "http://localhost:3000",
  "http://localhost:6060",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) callback(null, true);
      else callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// Routes
app.use("/api/v1", route);

// Stripe webhook → must use raw body!



// Test root
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});


// Global error handlers
app.use(globalErrorHandler);
app.use(NotfoundHandler);


// Cron job: cancel unpaid appointments every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("Cron: canceled unpaid appointments if any");
});

export default app;