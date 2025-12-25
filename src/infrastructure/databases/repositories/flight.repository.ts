import { Model, FilterQuery } from "mongoose";
import { IFlight } from "@domain/entities/flight.entity";
import FlightModel from "@infrastructure/databases/models/flight.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import {
  CreateFlightDTO,
  UpdateFlightDTO,
  ApproveFlightDTO,
  FlightListDTO,
  FlightDetailsDTO
} from "@application/dtos/flight-dtos";

export class FlightRepository
  extends BaseRepository<IFlight>
  implements IFlightRepository
{
  constructor(model: Model<IFlight> = FlightModel) {
    super(model);
  }

  async createFlight(data: CreateFlightDTO): Promise<FlightDetailsDTO> {
    
    const newFlight = new this.model({
      ...data,
        departureTime: new Date(data.departureTime),   // cast to Date
    // arrivalTime: new Date(data.arrivalTime), 
      flightStatus: "scheduled",
      adminApproval: { status: "pending" }
    });

    const savedFlight = await newFlight.save();
    const details = await this.getFlightDetails(savedFlight._id.toString());
    if (!details) {
      throw new Error("Failed to retrieve created flight");
    }
    return details;
  }

  async update(
    id: string,
    entity: Partial<IFlight>
  ): Promise<IFlight | null> {
    return await this.model
      .findByIdAndUpdate(id, entity, { new: true })
      .lean()
      .exec();
  }

  async updateFlight(
    flightId: string,
    data: UpdateFlightDTO
  ): Promise<FlightDetailsDTO | null> {
    const updated = await this.model
      .findOneAndUpdate({ flightId }, data, { new: true })
      .exec();

    if (!updated) return null;
    return await this.getFlightDetails(updated._id.toString());
  }

  async getFlightsByProvider(providerId: string): Promise<FlightDetailsDTO[]> {
    const flights = await this.model.aggregate([
      {
        $match: {
          providerId: this.parseId(providerId)
        }
      },
      ...this.baseDetailsPipeline(),
      { $sort: { departureTime: 1 } }
    ]);

    return flights as FlightDetailsDTO[];
  }

  async getPendingFlightsByProvider(
    providerId: string
  ): Promise<FlightDetailsDTO[]> {
    const flights = await this.model.aggregate([
      {
        $match: {
          providerId: this.parseId(providerId),
          "adminApproval.status": "pending"
        }
      },
      ...this.baseDetailsPipeline(),
      { $sort: { departureTime: 1 } }
    ]);

    return flights as FlightDetailsDTO[];
  }

  async getPendingFlightsForApproval(): Promise<FlightDetailsDTO[]> {
    const flights = await this.model.aggregate([
      {
        $match: {
          "adminApproval.status": "pending"
        }
      },
      ...this.baseDetailsPipeline(),
      { $sort: { departureTime: 1 } }
    ]);

    return flights as FlightDetailsDTO[];
  }

  async approveFlight(
  id: string,  // rename parameter to id for clarity
  data: ApproveFlightDTO
): Promise<FlightDetailsDTO | null> {
  const updated = await this.model
    .findByIdAndUpdate(
      id,  // ← NOW USES MongoDB _id
      {
        "adminApproval.status": data.status,
        "adminApproval.reviewedAt": new Date(),
        ...(data.reason && { "adminApproval.reason": data.reason })
      },
      { new: true }
    )
    .exec();

  if (!updated) return null;
  return await this.getFlightDetails(updated._id.toString());
}

  async getBookableFlights(): Promise<FlightListDTO[]> {
    const flights = await this.model.aggregate([
      {
        $match: {
          "adminApproval.status": "approved",
          flightStatus: "scheduled"
        }
      },
      ...this.baseListPipeline(),
      { $sort: { departureTime: 1 } }
    ]);

    return flights as FlightListDTO[];
  }

  async getFlightDetails(flightId: string): Promise<FlightDetailsDTO | null> {
    const result = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(flightId)
        }
      },
      ...this.baseDetailsPipeline()
    ]);

    return result.length > 0 ? (result[0] as FlightDetailsDTO) : null;
  }

  async isFlightBookable(flightId: string): Promise<boolean> {
    const flight = await this.model
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

  async findMany(query: FilterQuery<IFlight>): Promise<IFlight[]> {
    return (await this.model.find(query).lean().exec()) as IFlight[];
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
          providerId: 1,
          aircraftId: 1,
          seatLayoutId: 1,
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
