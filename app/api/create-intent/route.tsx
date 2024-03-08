import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIP_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-08-16",
});

export async function POST(req: any) {
  const data:any = await req.json();
  const amount = data.amount;

  console.log( "from route api",amount);
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100 ,
      currency: "USD",
    });

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}