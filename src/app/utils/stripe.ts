import { stripe } from "../../config/stripe.config";

interface StripePayload {
  ideaId: string;
  paymentId: string;
  buyerName: string;
  ideaTitle: string;
  price: number;
}

export const createCheckoutSession = async (payload: StripePayload) => {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: payload.ideaTitle,
            description: `Purchased by ${payload.buyerName}`,
          },
          unit_amount: payload.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      ideaId: payload.ideaId,
      paymentId: payload.paymentId,
    },
    success_url: `${process.env.FRONTEND_URL}/payment/success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
  });

  return session;
};