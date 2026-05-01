import { IAircraft } from "@domain/entities/aircraft.entity";
import AircraftModel from "@infrastructure/databases/models/aircraft.model";
import {BaseRepository} from "@infrastructure/databases/repositories/base.repository";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";


export class AircraftRepository
  extends BaseRepository<IAircraft>
  implements IAircraftRepository
{
  constructor() {
    super(AircraftModel);
  }
async createAircraft(data: Partial<IAircraft>): Promise<IAircraft> {
  const newAircraft = new AircraftModel(data);
  const savedAircraft = await newAircraft.save();
  const aircraft = await this.getAircraftById(savedAircraft.id);
  if (!aircraft) throw new Error("Failed to create aircraft");
  return aircraft;
}

  async updateAircraft(aircraftId: string, data: Partial<IAircraft>): Promise<IAircraft | null> {
    const updatedAircraft = await AircraftModel.findByIdAndUpdate(
      aircraftId,
      data,
      { new: true }
    ).exec();
    if (!updatedAircraft) return null;
    return this.getAircraftById(updatedAircraft.id);
  }

  async getAircraftById(aircraftId: string): Promise<IAircraft | null> {
    const aircraftData = await AircraftModel.aggregate([
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
     if (!aircraftData[0]) return null;
    return { ...aircraftData[0], id: aircraftData[0]._id.toString() }
  }

// async getAircraftsByProvider(providerId: string): Promise<IAircraft[]> {
//   const aircraftsData = await AircraftModel.aggregate([
//     {
//       $match: { providerId }
//     },
//     {
//       $addFields: {
//         baseStationObjectId: { $toObjectId: "$baseStationId" },
//         currentLocationObjectId: { $toObjectId: "$currentLocationId" }
//       }
//     },
//     {
//       $lookup: {
//         from: "destinations",
//         localField: "baseStationObjectId",
//         foreignField: "_id",
//         as: "baseStation"
//       }
//     },
//     {
//       $lookup: {
//         from: "destinations",
//         localField: "currentLocationObjectId",
//         foreignField: "_id",
//         as: "currentLocation"
//       }
//     },
//     { $unwind: { path: "$baseStation", preserveNullAndEmptyArrays: true } },
//     { $unwind: { path: "$currentLocation", preserveNullAndEmptyArrays: true } },
//     {
//       $project: {
//         _id: 1,
//         providerId: 1,
//         aircraftType: 1,
//         aircraftName: 1,
//         manufacturer: 1,
//         buildYear: 1,
//         seatCapacity: 1,
//         seatLayoutType: 1,
//         flyingRangeKm: 1,
//         engineCount: 1,
//         lavatoryCount: 1,
//         baseStationId: 1,
//         currentLocationId: 1,
//         availableFrom: 1,
//         status: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         "baseStation._id": 1,
//         "baseStation.name": 1,
//         "baseStation.city": 1,
//         "baseStation.country": 1,
//         "currentLocation._id": 1,
//         "currentLocation.name": 1,
//         "currentLocation.city": 1,
//         "currentLocation.country": 1
//       }
//     }
//   ]).sort({ createdAt: -1 });
//  return aircraftsData.map((a) => ({ ...a, id: a._id.toString() }))
  
// }

async getAircraftsByProvider(providerId: string): Promise<IAircraft[]> {
  const aircraftsData = await AircraftModel.aggregate([
    {
      $match: { providerId }
    },
    {
      $addFields: {
        baseStationObjectId: {
          $cond: {
            if: { $and: [{ $ne: ["$baseStationId", ""] }, { $ne: ["$baseStationId", null] }] },
            then: { $toObjectId: "$baseStationId" },
            else: null
          }
        },
        currentLocationObjectId: {
          $cond: {
            if: { $and: [{ $ne: ["$currentLocationId", ""] }, { $ne: ["$currentLocationId", null] }] },
            then: { $toObjectId: "$currentLocationId" },
            else: null
          }
        }
      }
    },
    {
      $lookup: {
        from: "destinations",
        localField: "baseStationObjectId",
        foreignField: "_id",
        as: "baseStation"
      }
    },
    {
      $lookup: {
        from: "destinations",
        localField: "currentLocationObjectId",
        foreignField: "_id",
        as: "currentLocation"
      }
    },
    { $unwind: { path: "$baseStation", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$currentLocation", preserveNullAndEmptyArrays: true } },
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
  ]).sort({ createdAt: -1 });

  return aircraftsData.map((a) => ({ ...a, id: a._id.toString() }));
}


    async getAllAircrafts(): Promise<IAircraft[]> {
    const aircraftsData = await AircraftModel.aggregate([
      {
        $lookup: {
          from: "destinations",
          localField: "currentLocationId",
          foreignField: "_id",
          as: "currentLocation"
        }
      },
      { $unwind: { path: "$currentLocation", preserveNullAndEmptyArrays: true } },
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
          "currentLocation.municipality": 1,
          "currentLocation.isoCountry": 1,
        }
      }
    ]).sort({ createdAt: -1 });
    return aircraftsData.map((a) => ({ ...a, id: a._id.toString() }));
  }

   async getActiveAircrafts(): Promise<IAircraft[]> {
    const aircraftsData = await AircraftModel.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "destinations",
          localField: "currentLocationId",
          foreignField: "_id",
          as: "currentLocation"
        }
      },
      { $unwind: { path: "$currentLocation", preserveNullAndEmptyArrays: true } },
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
          "currentLocation.municipality": 1,
          "currentLocation.isoCountry": 1,
        }
      }
    ]).sort({ createdAt: -1 });
    return aircraftsData.map((a) => ({ ...a, id: a._id.toString() }));
  }

  async updateStatus(aircraftId: string, status: "active" | "inactive" | "maintenance"): Promise<boolean> {
    const result = await AircraftModel.findByIdAndUpdate(
      aircraftId,
      { status },
      { new: true }
    ).exec();
    return result !== null;
  }

  async updateLocation(aircraftId: string, currentLocationId: string): Promise<boolean> {
    const result = await AircraftModel.findByIdAndUpdate(
      aircraftId,
      { currentLocationId },
      { new: true }
    ).exec();
    return result !== null;
  }

  async deleteAircraft(aircraftId: string): Promise<boolean> {
    const result = await AircraftModel.findByIdAndDelete(aircraftId).exec();
    return result !== null;
  }

  async isAircraftActive(aircraftId: string): Promise<boolean> {
    const aircraft = await AircraftModel.findById(aircraftId).select("status").exec();
    return aircraft?.status === "active" || false;
  }

async findByProviderId(
  providerId: string,
  page: number = 1,
  limit: number = 4
): Promise<{
  aircrafts: IAircraft[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  const totalCount = await AircraftModel.countDocuments({ providerId });

  const aircraftData = await AircraftModel.aggregate([
    { $match: { providerId } },
    {
      $addFields: {
        baseStationObjectId: {
          $cond: {
            if: { $and: [{ $ne: ["$baseStationId", ""] }, { $ne: ["$baseStationId", null] }] },
            then: { $toObjectId: "$baseStationId" },
            else: null
          }
        },
        currentLocationObjectId: {
          $cond: {
            if: { $and: [{ $ne: ["$currentLocationId", ""] }, { $ne: ["$currentLocationId", null] }] },
            then: { $toObjectId: "$currentLocationId" },
            else: null
          }
        }
      }
    },
    {
      $lookup: {
        from: "destinations",
        localField: "baseStationObjectId",
        foreignField: "_id",
        as: "baseStation"
      }
    },
    {
      $lookup: {
        from: "destinations",
        localField: "currentLocationObjectId",
        foreignField: "_id",
        as: "currentLocation"
      }
    },
    { $unwind: { path: "$baseStation", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$currentLocation", preserveNullAndEmptyArrays: true } },
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
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ]);

  const aircrafts: IAircraft[] = aircraftData.map((a) => ({
    ...a,
    id: a._id.toString()
  }));

  return {
    aircrafts,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

  async findByStatus(status: "active" | "inactive" | "maintenance"): Promise<IAircraft[]> {
    return await this.findMany({ status });
  }

  async availableAircraftsForSchedule(fromDate: Date): Promise<IAircraft[]> {
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
