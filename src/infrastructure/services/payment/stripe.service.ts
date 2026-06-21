import { injectable } from "inversify";
import stripeInstance from "@infrastructure/config/stripe.config";
import { IStripeService } from "@application/interfaces/service/payment/IStripe.service";
import {
  CreatePaymentIntent,
  PaymentIntentResult,
  PaymentIntentDetails,
  WebhookEvent,
} from "@application/dtos/service/stripe.service";

@injectable()
export class StripeService implements IStripeService {

  async createPaymentIntent(data: CreatePaymentIntent): Promise<PaymentIntentResult> {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: data.currency,
       automatic_payment_methods: { enabled: true },
      metadata: data.metadata,
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to create payment intent");
    }

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  constructWebhookEvent(
    payload: Buffer,
    signature: string,
    webhookSecret: string
  ): WebhookEvent {
    const event = stripeInstance.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    const obj = event.data.object as {
      id: string;
      amount: number;
      currency: string;
      status: string;
      metadata: Record<string, string>;
    };

    return {
      type: event.type,
      data: {
        id: obj.id,
        amount: obj.amount / 100,
        currency: obj.currency,
        status: obj.status,
        metadata: obj.metadata ?? {},
      },
    };
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntentDetails> {
    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    return {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata as Record<string, string>,
    };
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    await stripeInstance.paymentIntents.cancel(paymentIntentId);
  }
}