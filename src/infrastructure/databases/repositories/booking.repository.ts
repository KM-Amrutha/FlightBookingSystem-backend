import { IBooking } from "@domain/entities/booking.entity";
import BookingModel from "@infrastructure/databases/models/booking.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { paginateReq, paginateRes } from "@shared/utils/pagination";

export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      userId: 1,
      segments: 1,
      passengers: 1,
      flightFoods: 1,
      subtotal: 1,
      discount: 1,
      grandTotal: 1,
      status: 1,
      paymentIntentId: 1,
      paymentConfirmedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async createBooking(data: Partial<IBooking>): Promise<IBooking> {
    const newBooking = new BookingModel(data);
    const saved = await newBooking.save();
    const booking = await this.getBookingById(saved.id.toString());
    if (!booking) throw new Error("Failed to retrieve created booking");
    return booking;
  }

  async getBookingById(bookingId: string): Promise<IBooking | null> {
    const docs = await BookingModel.aggregate([
      { $match: { _id: this.parseId(bookingId) } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "payment_failed" | "cancelled",
    paymentIntentId?: string,
    paymentConfirmedAt?: Date
  ): Promise<IBooking | null> {
    const updateData: Partial<IBooking> = { status };
    if (paymentIntentId) updateData.paymentIntentId = paymentIntentId;
    if (paymentConfirmedAt) updateData.paymentConfirmedAt = paymentConfirmedAt;

    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getBookingById(updated.id.toString());
  }

  async getBookingsByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchStage = { userId: this.parseId(userId) };

    const [docs, totalCount] = await Promise.all([
      BookingModel.aggregate([
        { $match: matchStage },
        { $project: this.baseProjection() },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
      ]),
      BookingModel.countDocuments(matchStage),
    ]);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      bookings: docs.map((doc) => ({ ...doc, id: doc._id.toString() })),
      totalCount,
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
    };
  }

  async getBookingsByProviderId(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchStage = { "segments.providerId": providerId };

    const [docs, totalCount] = await Promise.all([
      BookingModel.aggregate([
        { $match: matchStage },
        { $project: this.baseProjection() },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
      ]),
      BookingModel.countDocuments(matchStage),
    ]);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      bookings: docs.map((doc) => ({ ...doc, id: doc._id.toString() })),
      totalCount,
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
    };
  }

  async getAllBookings(
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const [docs, totalCount] = await Promise.all([
      BookingModel.aggregate([
        { $project: this.baseProjection() },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
      ]),
      BookingModel.countDocuments(),
    ]);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      bookings: docs.map((doc) => ({ ...doc, id: doc._id.toString() })),
      totalCount,
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
    };
  }

  async cancelPassenger(
    bookingId: string,
    passengerId: string,
    refundAmount: number
  ): Promise<IBooking | null> {
    const updated = await BookingModel.findOneAndUpdate(
      {
        _id: this.parseId(bookingId),
        "passengers.passengerId": passengerId,
      },
      {
        $set: {
          "passengers.$.status": "cancelled",
          "passengers.$.cancelledAt": new Date(),
          "passengers.$.refundAmount": refundAmount,
        },
      },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getBookingById(updated.id.toString());
  }

  async cancelBooking(bookingId: string): Promise<IBooking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getBookingById(updated.id.toString());
  }

  async getBookingByPaymentIntentId(
    paymentIntentId: string
  ): Promise<IBooking | null> {
    const docs = await BookingModel.aggregate([
      { $match: { paymentIntentId } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }
}