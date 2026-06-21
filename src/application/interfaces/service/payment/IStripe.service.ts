import {
  CreatePaymentIntent,
  PaymentIntentResult,
  PaymentIntentDetails,
  WebhookEvent,
} from "@application/dtos/service/stripe.service";

export interface IStripeService {
  createPaymentIntent(data: CreatePaymentIntent): Promise<PaymentIntentResult>;
  constructWebhookEvent(payload: Buffer, signature: string, webhookSecret: string): WebhookEvent;
  retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntentDetails>;
  cancelPaymentIntent(paymentIntentId: string): Promise<void>;
}