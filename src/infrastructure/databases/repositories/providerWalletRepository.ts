import { IProviderWallet, IProviderWalletTransaction } from "@domain/entities/providerWallet.entity";
import ProviderWalletModel from "@infrastructure/databases/models/providerWallet.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IProviderWalletRepository } from "@domain/interfaces/IProviderWalletRepository";

export class ProviderWalletRepository
  extends BaseRepository<IProviderWallet>
  implements IProviderWalletRepository
{
  constructor() {
    super(ProviderWalletModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      providerId: 1,
      balance: 1,
      transactions: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async getWalletByProviderId(providerId: string): Promise<IProviderWallet | null> {
    const docs = await ProviderWalletModel.aggregate([
      { $match: { providerId: this.parseId(providerId) } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async createWallet(providerId: string): Promise<IProviderWallet> {
    const newWallet = new ProviderWalletModel({
      providerId: this.parseId(providerId),
      balance: 0,
      transactions: [],
    });
    await newWallet.save();
    const wallet = await this.getWalletByProviderId(providerId);
    if (!wallet) throw new Error("Failed to retrieve created provider wallet");
    return wallet;
  }

  async creditWallet(
    providerId: string,
    transaction: IProviderWalletTransaction,
    amount: number
  ): Promise<IProviderWallet> {
    await ProviderWalletModel.findOneAndUpdate(
      { providerId: this.parseId(providerId) },
      {
        $inc: { balance: amount },
        $push: { transactions: transaction },
      },
      { upsert: true, new: true }
    ).exec();

    const wallet = await this.getWalletByProviderId(providerId);
    if (!wallet) throw new Error("Failed to retrieve provider wallet after credit");
    return wallet;
  }
}