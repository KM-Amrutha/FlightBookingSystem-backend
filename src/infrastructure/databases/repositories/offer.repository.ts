import { IOffer } from "@domain/entities/offer.entity";
import OfferModel from "@infrastructure/databases/models/offer.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { paginateReq, paginateRes } from "@shared/utils/pagination";

export class OfferRepository
  extends BaseRepository<IOffer>
  implements IOfferRepository
{
  constructor() {
    super(OfferModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      aircraftId: 1,
      providerId: 1,
      offerCode: 1,
      description: 1,
      discountPercentage: 1,
      minimumAmount: 1,
      validFrom: 1,
      validTo: 1,
      isActive: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async createOffer(data: Partial<IOffer>): Promise<IOffer> {
    const newOffer = new OfferModel(data);
    const saved = await newOffer.save();
    const offer = await this.getOfferById(saved.id.toString());
    if (!offer) throw new Error("Failed to retrieve created offer");
    return offer;
  }

  async getOfferById(offerId: string): Promise<IOffer | null> {
    const docs = await OfferModel.aggregate([
      { $match: { _id: this.parseId(offerId) } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async getOfferByCode(offerCode: string): Promise<IOffer | null> {
    const docs = await OfferModel.aggregate([
      { $match: { offerCode: offerCode.toUpperCase() } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async getOffersByProviderId(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    offers: IOffer[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchStage = { providerId: this.parseId(providerId) };

    const [docs, totalCount] = await Promise.all([
      OfferModel.aggregate([
        { $match: matchStage },
        {
  $lookup: {
    from: "aircrafts",
    localField: "aircraftId",
    foreignField: "_id",
    as: "aircraft",
  },
},
{
  $unwind: {
    path: "$aircraft",
    preserveNullAndEmptyArrays: true,
  },
},
        { $project: {
    ...this.baseProjection(),
    aircraftName: "$aircraft.aircraftName",
  }, },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
      ]),
      OfferModel.countDocuments(matchStage),
    ]);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      offers: docs.map((doc) => ({ ...doc, id: doc._id.toString() })),
      totalCount,
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
    };
  }

async getEligibleOffersByAircraftIds(
  aircraftIds: string[],
  grandTotal: number,
  currentDate: Date
): Promise<IOffer[]> {
  const docs = await OfferModel.aggregate([
    {
      $match: {
        aircraftId: {
          $in: aircraftIds.map((id) => this.parseId(id)),
        },
        isActive: true,
        minimumAmount: { $lte: grandTotal },
        validFrom: { $lte: currentDate },
        validTo: { $gte: currentDate },
        $or: [
          { usageLimit: null },
          { usageLimit: { $exists: false } },
          { $expr: { $lt: ["$usageCount", "$usageLimit"] } },
        ],
      },
    },
    { $project: this.baseProjection() },
    { $sort: { discountPercentage: -1 } },
  ]);
  return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
}

  async updateOffer(
    offerId: string,
    data: Partial<IOffer>
  ): Promise<IOffer | null> {
    const updated = await OfferModel.findByIdAndUpdate(offerId, data, {
      new: true,
    }).exec();
    if (!updated) return null;
    return this.getOfferById(updated.id.toString());
  }

  async deleteOfferById(offerId: string): Promise<IOffer | null> {
    const offer = await this.getOfferById(offerId);
    if (!offer) return null;
    await OfferModel.findByIdAndDelete(offerId).exec();
    return offer;
  }

  async toggleOfferStatus(
    offerId: string,
    isActive: boolean
  ): Promise<IOffer | null> {
    const updated = await OfferModel.findByIdAndUpdate(
      offerId,
      { isActive },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getOfferById(updated.id.toString());
  }

  async incrementUsageCount(offerId: string): Promise<IOffer | null> {
  const updated = await OfferModel.findByIdAndUpdate(
    offerId,
    { $inc: { usageCount: 1 } },
    { new: true }
  ).exec();
  if (!updated) return null;
  return this.getOfferById(updated.id.toString());
}
}