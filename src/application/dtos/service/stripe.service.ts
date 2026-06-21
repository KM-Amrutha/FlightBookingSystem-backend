export interface CreatePaymentIntent {
  amount: number;
  currency: string;
  metadata: Record<string, string>;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentIntentDetails {
  paymentIntentId: string;
  status: string;
  amount: number;
  currency: string;
  metadata: Record<string, string>;
}

export interface WebhookPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
}

export interface WebhookEvent {
  type: string;
  data: WebhookPaymentIntent;
}