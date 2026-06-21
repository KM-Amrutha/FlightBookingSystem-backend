import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

if (!STRIPE_SECRET_KEY) {
  console.error("Stripe secret key is missing in .env");
  process.exit(1);
}

const stripeClient: InstanceType<typeof Stripe> = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

export default stripeClient;