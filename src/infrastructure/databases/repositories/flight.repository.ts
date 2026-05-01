import {FilterQuery } from "mongoose";
import { IFlight } from "@domain/entities/flight.entity";
import FlightModel from "@infrastructure/databases/models/flight.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";

export class FlightRepository
  extends BaseRepository<IFlight>
  implements IFlightRepository
{
  constructor() {
    super(FlightModel);
  }

    async createFlight(data: Partial<IFlight>): Promise<IFlight> {
    const newFlight = new FlightModel({
      ...data,
      flightStatus: "scheduled",
      adminApproval: { status: "pending" }
    });
    const savedFlight = await newFlight.save();
    const details = await this.getFlightDetails(savedFlight.id.toString());
    if (!details) throw new Error("Failed to retrieve created flight");
    return details;
  }

  async update(id: string, entity: Partial<IFlight>): Promise<IFlight | null> {
    return await FlightModel.findByIdAndUpdate(id, entity, { new: true })
      .lean()
      .exec() as IFlight | null;
  }

  async updateFlight(flightId: string, data: Partial<IFlight>): Promise<IFlight | null> {
    const updateObj = {
      ...data,
      "adminApproval.status": "pending",
      "adminApproval.reason": null,
      "adminApproval.reviewedAt": null
    };
    const updated = await FlightModel.findByIdAndUpdate(
      flightId,
      updateObj,
      { new: true }
    ).exec();
    if (!updated) return null;
    return await this.getFlightDetails(updated.id.toString());
  }

  async getFlightsByProvider(
  providerId: string,
  page: number = 1,
  limit: number = 6
): Promise<{
  flights: IFlight[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  const matchStage = { providerId: this.parseId(providerId) };

  const [flights, totalCount] = await Promise.all([
    FlightModel.aggregate([
      { $match: matchStage },
      ...this.baseDetailsPipeline(),
      { $sort: { departureTime: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]),
    FlightModel.countDocuments(matchStage),
  ]);

  return {
    flights: flights.map((f) => ({ ...f, id: f._id.toString() })),
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

  async getPendingFlightsByProvider(providerId: string): Promise<IFlight[]> {
    const flights = await FlightModel.aggregate([
      {
        $match: {
          providerId: this.parseId(providerId),
          "adminApproval.status": "pending"
        }
      },
      ...this.baseDetailsPipeline(),
      { $sort: { departureTime: 1 } }
    ]);
    return flights.map((f) => ({ ...f, id: f._id.toString() }));
  }


async getPendingFlightsForApproval(): Promise<IFlight[]> {
  const flights = await FlightModel.aggregate([
    {
      $match: {
        "adminApproval.status": "pending",
        flightType: { $ne: "return" }, // ← exclude return flights
      }
    },
    ...this.baseDetailsPipeline(),
    { $sort: { departureTime: 1 } }
  ]);
  return flights.map((f) => ({ ...f, id: f._id.toString() }));
}

  async approveFlight(
    flightId: string,
    status: "approved" | "rejected",
    reason?: string
  ): Promise<IFlight | null> {
    const updated = await FlightModel.findByIdAndUpdate(
      flightId,
      {
        "adminApproval.status": status,
        "adminApproval.reviewedAt": new Date(),
        ...(reason && { "adminApproval.reason": reason })
      },
      { new: true }
    ).exec();
    if (!updated) return null;
    return await this.getFlightDetails(updated.id.toString());
  }

  async approveFlightsByGroupId(
  recurringGroupId: string,
  status: "approved" | "rejected",
  reason?: string
): Promise<void> {
  await FlightModel.updateMany(
    { recurringGroupId },
    {
      "adminApproval.status": status,
      "adminApproval.reviewedAt": new Date(),
      ...(reason && { "adminApproval.reason": reason }),
    }
  ).exec();
}

async approveReturnFlight(
  parentFlightId: string,
  status: "approved" | "rejected",
  reason?: string
): Promise<void> {
  await FlightModel.updateOne(
    { parentFlightId: this.parseId(parentFlightId), flightType: "return" },
    {
      "adminApproval.status": status,
      "adminApproval.reviewedAt": new Date(),
      ...(reason && { "adminApproval.reason": reason }),
    }
  ).exec();
}

async getAllFlightsForAdmin(
  page: number = 1,
  limit: number = 10
): Promise<{
  flights: IFlight[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  const matchStage = {
    "adminApproval.status": "approved",
    flightStatus: "scheduled",
  };

  const [flights, totalCount] = await Promise.all([
    FlightModel.aggregate([
      { $match: matchStage },
      ...this.baseDetailsPipeline(),
      { $sort: { departureTime: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]),
    FlightModel.countDocuments(matchStage),
  ]);

  return {
    flights: flights.map((f) => ({ ...f, id: f._id.toString() })),
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  };
}
  
   async getFlightDetails(flightId: string): Promise<IFlight | null> {
    const result = await FlightModel.aggregate([
      { $match: { _id: this.parseId(flightId) } },
      ...this.baseDetailsPipeline()
    ]);
    if (!result[0]) return null;
    return { ...result[0], id: result[0]._id.toString() };
  }

     async getBookableFlights(): Promise<IFlight[]> {
    const flights = await FlightModel.aggregate([
      {
        $match: {
          "adminApproval.status": "approved",
          flightStatus: "scheduled"
        }
      },
      ...this.baseListPipeline(),
      { $sort: { departureTime: 1 } }
    ]);
    return flights.map((f) => ({ ...f, id: f._id.toString() }));
  }

  async isFlightBookable(flightId: string): Promise<boolean> {
    const flight = await FlightModel
      .findOne({
        flightId,
        "adminApproval.status": "approved",
        flightStatus: "scheduled"
      })
      .select("_id")
      .lean()
      .exec();

    return !!flight;
  }

async searchFlights(
  fromCodes: string[],
  toCodes: string[],
  departureDateStart: Date,
  departureDateEnd: Date
): Promise<IFlight[]> {
  const fromRegexes = fromCodes.map((c) => new RegExp(`^${c.trim()}$`, "i"));
  const toRegexes = toCodes.map((c) => new RegExp(`^${c.trim()}$`, "i"));

  const postLookupMatch: Record<string, unknown> = {};

  if (fromCodes.length > 0) {
    postLookupMatch["departureDestination.iataCode"] = { $in: fromRegexes };
  }

  if (toCodes.length > 0) {
    postLookupMatch["arrivalDestination.iataCode"] = { $in: toRegexes };
  }

  const flights = await FlightModel.aggregate([
    {
      $match: {
        "adminApproval.status": "approved",
        flightStatus: "scheduled",
        departureTime: {
          $gte: departureDateStart,
          $lte: departureDateEnd,
        },
      },
    },
    ...this.baseDetailsPipeline(),
    ...(Object.keys(postLookupMatch).length > 0
      ? [{ $match: postLookupMatch }]
      : []
    ),
    { $sort: { departureTime: 1 } },
  ]);

  return flights.map((f) => ({ ...f, id: f._id.toString() }));
}

async findMany(query: FilterQuery<IFlight>): Promise<IFlight[]> {
  const results = await FlightModel.find(query).lean().exec();
  return results.map((f) => {
    const { _id, __v, ...rest } = f as typeof f & {
      _id: { toString(): string };
      __v?: number;
    };
    return {
      ...rest,
      id: _id.toString(),
    };
  }) as IFlight[];
}

async hasActiveFlightsForAircraft(aircraftId: string): Promise<boolean> {
  const flight = await FlightModel.findOne({
    aircraftId: this.parseId(aircraftId),
    flightStatus: "scheduled",
    "adminApproval.status": { $in: ["pending", "approved"] }
  }).select("_id").lean().exec();
  return !!flight;
}

async deleteFlightById(flightId: string): Promise<IFlight | null> {
  const flight = await this.getFlightDetails(flightId);
  if (!flight) return null;
  await FlightModel.findByIdAndDelete(flightId).exec();
  return flight;
}

async getActiveFlightsForAircraft(aircraftId: string): Promise<IFlight[]> {
  const flights = await FlightModel.find({
    aircraftId: this.parseId(aircraftId),
    flightStatus: "scheduled",
    "adminApproval.status": { $ne: "rejected" },
  })
    .select({
      _id: 1,
      aircraftId: 1,
      flightType: 1,
      departureDestinationId: 1,
      arrivalDestinationId: 1,
      departureTime: 1,
      arrivalTime: 1,
      durationMinutes: 1,
       bufferMinutes: 1,
      flightStatus: 1,
    })
    .lean()
    .exec();

  return flights.map((f) => {
    const { _id, __v, ...rest } = f as typeof f & {
      _id: { toString(): string };
      __v?: number;
    };
    return { ...rest, id: _id.toString() } as IFlight;
  });
}

  // ---- private pipelines ----

  private baseDetailsPipeline() {
    return [
      {
        $lookup: {
          from: "aircrafts",
          localField: "aircraftId",
          foreignField: "_id",
          as: "aircraft"
        }
      },
      { $unwind: { path: "$aircraft", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "destinations",
          localField: "departureDestinationId",
          foreignField: "_id",
          as: "departureDestination"
        }
      },
      { $unwind: { path: "$departureDestination", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "destinations",
          localField: "arrivalDestinationId",
          foreignField: "_id",
          as: "arrivalDestination"
        }
      },
      { $unwind: { path: "$arrivalDestination", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          flightId: 1,
          flightNumber: 1,
          aircraftName: 1,
          providerId: { $toString: "$providerId" },
          aircraftId: 1,
          seatLayoutId: 1,
           flightType: 1,       
        parentFlightId: 1,       
        recurringGroupId: 1,    
        recurringDays: 1,
          departureDestinationId: 1,
          arrivalDestinationId: 1,
          departureTime: 1,
          arrivalTime: 1,
          durationMinutes: 1,
          gate: 1,
          baseFare: 1,
          seatSurcharge: 1,
          baggageRules: 1,
          luggageRuleId: 1,
          foodMenuId: 1,
          flightStatus: 1,
          adminApproval: 1,
          createdAt: 1,
          updatedAt: 1,
          "departureDestination.name": 1,
          "departureDestination.iataCode": 1,
          "arrivalDestination.name": 1,
          "arrivalDestination.iataCode": 1
        }
      }
    ];
  }

  private baseListPipeline() {
    return [
      {
        $project: {
          _id: 1,
          flightId: 1,
          flightNumber: 1,
          aircraftName: 1,
          providerId: 1,
          departureDestinationId: 1,
          arrivalDestinationId: 1,
          departureTime: 1,
          arrivalTime: 1,
          durationMinutes: 1,
          baseFare: 1,
          adminApproval: 1,
          flightStatus: 1
        }
      }
    ];
  }
}
