import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IHandleWebhookUseCase } from "@di/file-imports-index";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";

@injectable()
export class HandleWebhookController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.HandleWebhookUseCase)
    private readonly _handleWebhookUseCase: IHandleWebhookUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    try {
      await this._handleWebhookUseCase.execute(req.body as Buffer, signature);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook processing error:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
}