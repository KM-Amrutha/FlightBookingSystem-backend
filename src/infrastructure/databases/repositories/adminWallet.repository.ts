import { IAdminWallet, IAdminWalletTransaction } from "@domain/entities/adminWallet.entity";
import AdminWalletModel from "@infrastructure/databases/models/adminWallet.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IAdminWalletRepository } from "@domain/interfaces/IAdminWalletRepository";

export class AdminWalletRepository
  extends BaseRepository<IAdminWallet>
  implements IAdminWalletRepository
{
  constructor() {
    super(AdminWalletModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      balance: 1,
      transactions: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async getAdminWallet(): Promise<IAdminWallet | null> {
    const docs = await AdminWalletModel.aggregate([
      { $project: this.baseProjection() },
      { $limit: 1 },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async creditWallet(
    transaction: IAdminWalletTransaction,
    amount: number
  ): Promise<IAdminWallet> {
    await AdminWalletModel.findOneAndUpdate(
      {},
      {
        $inc: { balance: amount },
        $push: { transactions: transaction },
      },
      { upsert: true, new: true }
    ).exec();

    const wallet = await this.getAdminWallet();
    if (!wallet) throw new Error("Failed to retrieve admin wallet after credit");
    return wallet;
  }
}