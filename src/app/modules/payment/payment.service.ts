import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../../config/env";
import { IdeaStatus, IdeaType, PaymentStatus } from "../../../generated/prisma/enums";
import Stripe from "stripe";
import { generatePaymentConfirmationImage } from "./payment.utils";
import { sendEmail } from "../../utils/email";
import { uploadFileToCloudinary } from "../../../config/cloude.config";
import { createCheckoutSession } from "../../utils/stripe";
import { status } from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelplers/appError";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27" as any,
});

// ✅ Step 1 — Payment Initiate
const initiatePayment = async (ideaId: string, user: JwtPayload) => {
  const isAuthor = await prisma.idea.findFirst({
    where: { id: ideaId, authorId: user?.id },
  });
  console.log("isAuthor:", isAuthor);
  if (isAuthor) {
    throw new AppError(status.NOT_ACCEPTABLE,"You are author of this idea");
  }
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false, status: IdeaStatus.APPROVED },
  });

  if (!idea) {
    throw new AppError(status.NOT_FOUND, "Idea not found");
  }

  if (idea.type !== IdeaType.PAID) {
    throw new AppError(status.BAD_REQUEST, "This idea is free");
  }

  if (!idea.price) {
    throw new AppError(status.BAD_REQUEST, "Idea price is not set");
  }

  // আগে কিনেছে কিনা check
  const existingPayment = await prisma.payment.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } },
  });

  if (existingPayment?.status === PaymentStatus.SUCCESS) {
    throw new AppError(status.BAD_REQUEST, "You already purchased this idea");
  }

  // Buyer info
  const buyer = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  if (!buyer) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  // Payment record create বা reuse করো
  let payment;
  if (existingPayment) {
    payment = await prisma.payment.update({
      where: { id: existingPayment.id },
      data: { status: PaymentStatus.PENDING },
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        amount: idea.price,
        ideaId,
        userId: user?.id,
        status: PaymentStatus.PENDING,
      },
    });
  }

  // Stripe checkout session create
  const session = await createCheckoutSession({
    ideaId,
    paymentId: payment.id,
    buyerName: buyer.name,
    ideaTitle: idea.title,
    price: idea.price,
  });

  return {
    paymentUrl: session.url,
    paymentId: payment.id,
    sessionId: session.id,
  };
};

// ✅ Step 2 — Stripe Webhook Handler
const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      envVars.WEBHOOK_SIGNING_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Duplicate event check
  const existingEvent = await prisma.payment.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existingEvent) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return res.json({ message: `Event ${event.id} already processed` });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;

      const ideaId = session.metadata?.ideaId;
      const paymentId = session.metadata?.paymentId;

      if (!ideaId || !paymentId) {
        return res.status(400).json({ message: "Missing ideaId or paymentId" });
      }

      // Payment update
      const paymentData = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          stripeEventId: event.id,
          status: session.payment_status === "paid"
            ? PaymentStatus.SUCCESS
            : PaymentStatus.FAILED,
          paymentGatewayData: session,
        },
        include: {
          idea: true,
          user: true,
        },
      });

      // Invoice image generate
      const imageBuffer = await generatePaymentConfirmationImage({
        authorName: paymentData.user.name,
        authorEmail: paymentData.user.email,
        ideaTitle: paymentData.idea.title,
        amount: session.amount_total / 100,
        ideaId,
        paymentId,
        date: new Date().toDateString(),
      });

      // Cloudinary upload
      const fileName = `ecospark-invoice-${paymentData.user.name}-${Date.now()}.png`;
      const uploadResult = await uploadFileToCloudinary(imageBuffer, fileName);

      if (!uploadResult?.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      // Invoice URL save
      await prisma.payment.update({
        where: { id: paymentId },
        data: { invoiceUrl: uploadResult.secure_url },
      });

      // Confirmation email
      await sendEmail({
        to: paymentData.user.email,
        subject: "Payment Confirmation - EcoSpark Hub",
        templateName: "paymentConfirmationEmail",
        templateData: {
          authorName: paymentData.user.name,
          authorEmail: paymentData.user.email,
          ideaTitle: paymentData.idea.title,
          amount: session.amount_total / 100,
          ideaId,
          paymentId,
          date: new Date().toDateString(),
          imageUrl: uploadResult.secure_url,
        },
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as any;
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return res.json({ received: true, message: `Event ${event.id} processed` });
};

// ✅ Step 3 — Verify Payment (idea কেনা হয়েছে কিনা)
const verifyPayment = async (ideaId: string, user: JwtPayload) => {
  const payment = await prisma.payment.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } },
  });

  return {
    isPurchased: payment?.status === PaymentStatus.SUCCESS,
    invoiceUrl: payment?.invoiceUrl || null,
  };
};

// ✅ Step 4 — My Payments
const getMyPayments = async (user: JwtPayload) => {
  const payments = await prisma.payment.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          images: true,
          type: true,
          price: true,
        },
      },
    },
  });

  return payments;
};

export const paymentService = {
  initiatePayment,
  handleStripeWebhookEvent,
  verifyPayment,
  getMyPayments,
};


