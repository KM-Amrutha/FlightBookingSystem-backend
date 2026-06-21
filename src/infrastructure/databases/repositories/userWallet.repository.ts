import { IWallet, IWalletTransaction } from "@domain/entities/userWallet.entity";
import WalletModel from "@infrastructure/databases/models/userWallet.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IUserWalletRepository } from "@domain/interfaces/IUserWalletRepository";

export class UserWalletRepository
  extends BaseRepository<IWallet>
  implements IUserWalletRepository
{
  constructor() {
    super(WalletModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      userId: 1,
      balance: 1,
      transactions: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async getWalletByUserId(userId: string): Promise<IWallet | null> {
    const docs = await WalletModel.aggregate([
      { $match: { userId: this.parseId(userId) } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async createWallet(userId: string): Promise<IWallet> {
    const newWallet = new WalletModel({
      userId: this.parseId(userId),
      balance: 0,
      transactions: [],
    });
    await newWallet.save();
    const wallet = await this.getWalletByUserId(userId);
    if (!wallet) throw new Error("Failed to retrieve created wallet");
    return wallet;
  }

  async creditWallet(
    userId: string,
    transaction: IWalletTransaction,
    amount: number
  ): Promise<IWallet> {
    await WalletModel.findOneAndUpdate(
      { userId: this.parseId(userId) },
      {
        $inc: { balance: amount },
        $push: { transactions: transaction },
      },
      { upsert: true, new: true }
    ).exec();

    const wallet = await this.getWalletByUserId(userId);
    if (!wallet) throw new Error("Failed to retrieve wallet after credit");
    return wallet;
  }
}