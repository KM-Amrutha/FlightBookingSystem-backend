import { inject, injectable } from "inversify";
import crypto from "crypto";
import { IBooking } from "@domain/entities/booking.entity";
import {
  IProviderWalletTransaction,
} from "@domain/entities/providerWallet.entity";
import { IProviderWalletRepository } from "@domain/interfaces/IProviderWalletRepository";
import { IProviderWalletService } from "@di/file-imports-index";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";

import { WALLET_MESSAGES } from "@shared/constants/walletMessages/wallet.messages";

@injectable()
export class ProviderWalletService
  implements IProviderWalletService
{
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.ProviderWalletRepository)
    private readonly _providerWalletRepository: IProviderWalletRepository
  ) {}

  async settleBookingRevenue(booking: IBooking): Promise<void> {
    const providerCreditMap = new Map<string, number>();

    // ── aggregate passenger segment revenue ─────────────────────────────
    for (const passenger of booking.passengers) {
      if (passenger.status === "cancelled") continue;

      for (const segment of passenger.segments) {
        if (segment.status === "cancelled") continue;

        const currentAmount =
          providerCreditMap.get(segment.providerId) ?? 0;

        providerCreditMap.set(
          segment.providerId,
          currentAmount + segment.segmentFare
        );
      }
    }

    // ── aggregate food revenue ──────────────────────────────────────────
    for (const flightFood of booking.flightFoods) {
      if (flightFood.flightFoodTotal <= 0) continue;

      const currentAmount =
        providerCreditMap.get(flightFood.providerId) ?? 0;

      providerCreditMap.set(
        flightFood.providerId,
        currentAmount + flightFood.flightFoodTotal
      );
    }

    // ── settle each provider ────────────────────────────────────────────
    for (const [providerId, amount] of providerCreditMap.entries()) {
      if (amount <= 0) continue;

      let wallet =
        await this._providerWalletRepository.getWalletByProviderId(
          providerId
        );

      if (!wallet) {
        wallet =
          await this._providerWalletRepository.createWallet(
            providerId
          );
      }

      const transaction: IProviderWalletTransaction = {
        transactionId: crypto.randomUUID(),
        type: "credit",
        amount,
        description: WALLET_MESSAGES.PROVIDER_BOOKING_REVENUE,
        bookingId: booking.id,
        createdAt: new Date(),
      };

      await this._providerWalletRepository.creditWallet(
        providerId,
        transaction,
        amount
      );
    }
  }
}