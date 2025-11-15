
import { IAircraft } from "@domain/entities/aircraft.entity";
import AircraftModel from "@infrastructure/databases/models/aircraft.model";
import { Model } from "mongoose";
import {BaseRepository} from "@infrastructure/databases/repositories/base.repository";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import {
  CreateAircraftDTO,
  UpdateAircraftDTO,
  UpdateAircraftStatusDTO,
  UpdateAircraftLocationDTO,
  AircraftDetailsDTO
} from "@application/dtos/aircraft-dtos";

export class AircraftRepository
  extends BaseRepository<IAircraft>
  implements IAircraftRepository
{
  constructor(model: Model<IAircraft> = AircraftModel) {
    super(model);
  }

  async createAircraft(data: CreateAircraftDTO): Promise<AircraftDetailsDTO> {
    const newAircraft = new this.model(data);
    const savedAircraft = await newAircraft.save();
    return this.getAircraftById(savedAircraft._id);
  }

  async updateAircraft(
    aircraftId: string,
    data: UpdateAircraftDTO
  ): Promise<AircraftDetailsDTO | null> {
    const updatedAircraft = await this.model.findByIdAndUpdate(
      aircraftId,
      data,
      { new: true }
    ).exec();

    if (!updatedAircraft) return null;
    return this.getAircraftById(updatedAircraft._id);
  }

  async getAircraftById(aircraftId: string): Promise<AircraftDetailsDTO> {
    const aircraftData = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(aircraftId)
        }
      },
      {
        $lookup: {
          from: "destinations",
          localField: "baseStationId",
          foreignField: "_id",
          as: "baseStation"
        }
      },
      {
        $lookup: {
          from: "destinations",
          localField: "currentLocationId",
          foreignField: "_id",
          as: "currentLocation"
        }
      },
      {
        $unwind: {
          path: "$baseStation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$currentLocation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          providerId: 1,
          aircraftType: 1,
          aircraftName: 1,
          manufacturer: 1,
          buildYear: 1,
          seatCapacity: 1,
          seatLayoutType: 1,
          flyingRangeKm: 1,
          engineCount: 1,
          lavatoryCount: 1,
          baseStationId: 1,
          currentLocationId: 1,
          availableFrom: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "baseStation._id": 1,
          "baseStation.name": 1,
          "baseStation.city": 1,
          "baseStation.country": 1,
          "currentLocation._id": 1,
          "currentLocation.name": 1,
          "currentLocation.city": 1,
          "currentLocation.country": 1
        }
      }
    ]);
    return aircraftData[0];
  }

  async getAircraftsByProvider(providerId: string): Promise<AircraftDetailsDTO[]> {
    const aircraftsData = await this.model.aggregate([
      {
        $match: {
          providerId: providerId
        }
      },
      {
        $lookup: {
          from: "destinations",
          localField: "currentLocationId",
          foreignField: "_id",
          as: "currentLocation"
        }
      },
      {
        $unwind: {
          path: "$currentLocation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          providerId: 1,
          aircraftType: 1,
          aircraftName: 1,
          manufacturer: 1,
          buildYear: 1,
          seatCapacity: 1,
          seatLayoutType: 1,
          flyingRangeKm: 1,
          engineCount: 1,
          lavatoryCount: 1,
          baseStationId: 1,
          currentLocationId: 1,
          availableFrom: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "currentLocation._id": 1,
          "currentLocation.name": 1,
          "currentLocation.city": 1,
          "currentLocation.country": 1
        }
      }
    ]).sort({ createdAt: -1 });
    return aircraftsData;
  }

  async getAllAircrafts(): Promise<AircraftDetailsDTO[]> {
    const aircraftsData = await this.model.aggregate([
      {
        $lookup: {
          from: "destinations",
          localField: "currentLocationId",
          foreignField: "_id",
          as: "currentLocation"
        }
      },
      {
        $unwind: {
          path: "$currentLocation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          providerId: 1,
          aircraftType: 1,
          aircraftName: 1,
          manufacturer: 1,
          buildYear: 1,
          seatCapacity: 1,
          seatLayoutType: 1,
          flyingRangeKm: 1,
          engineCount: 1,
          lavatoryCount: 1,
          baseStationId: 1,
          currentLocationId: 1,
          availableFrom: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "currentLocation._id": 1,
          "currentLocation.name": 1,
          "currentLocation.city": 1,
          "currentLocation.country": 1
        }
      }
    ]).sort({ createdAt: -1 });
    return aircraftsData;
  }

  async getActiveAircrafts(): Promise<AircraftDetailsDTO[]> {
    const aircraftsData = await this.model.aggregate([
      {
        $match: {
          status: "active"
        }
      },
      {
        $lookup: {
          from: "destinations",
          localField: "currentLocationId",
          foreignField: "_id",
          as: "currentLocation"
        }
      },
      {
        $unwind: {
          path: "$currentLocation",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          providerId: 1,
          aircraftType: 1,
          aircraftName: 1,
          manufacturer: 1,
          buildYear: 1,
          seatCapacity: 1,
          seatLayoutType: 1,
          flyingRangeKm: 1,
          engineCount: 1,
          lavatoryCount: 1,
          baseStationId: 1,
          currentLocationId: 1,
          availableFrom: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          "currentLocation._id": 1,
          "currentLocation.name": 1,
          "currentLocation.city": 1,
          "currentLocation.country": 1
        }
      }
    ]).sort({ createdAt: -1 });
    return aircraftsData;
  }

  async updateStatus({ aircraftId, status }: UpdateAircraftStatusDTO): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      aircraftId,
      { status },
      { new: true }
    ).exec();
    return result !== null;
  }

  async updateLocation({ aircraftId, currentLocationId }: UpdateAircraftLocationDTO): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      aircraftId,
      { currentLocationId },
      { new: true }
    ).exec();
    return result !== null;
  }

  async deleteAircraft(aircraftId: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(aircraftId).exec();
    return result !== null;
  }

  async isAircraftActive(aircraftId: string): Promise<boolean> {
    const aircraft = await this.model
      .findById(aircraftId)
      .select("status")
      .exec();
    return aircraft?.status === "active" || false;
  }

  async findByProviderId(providerId: string): Promise<IAircraft[]> {
  return await this.findMany({ providerId });
}

async findByStatus(status: "active" | "inactive" | "maintenance"): Promise<IAircraft[]> {
  return await this.findMany({ status });
}

async findAvailableAircrafts(fromDate: Date): Promise<IAircraft[]> {
  return await this.findMany({   
    status: "active",
    availableFrom: { $lte: fromDate }
  });
}

async findByType(aircraftType: string): Promise<IAircraft[]> {
  return await this.findMany({ aircraftType });
}

async getAircraftDetails(aircraftId: string): Promise<IAircraft | null> {
  return await this.findById(aircraftId);
}


}
