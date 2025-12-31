import { Model } from "mongoose";
import { IDestination } from "@domain/entities/destination.entity";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IDestinationRepository } from "@domain/interfaces/IDestinationRepository";
import DestinationModel from "@infrastructure/databases/models/destination.model";

export class DestinationRepository
  extends BaseRepository<IDestination>
  implements IDestinationRepository
{
  constructor(model: Model<IDestination> = DestinationModel) {
    super(model);
  }

  async findByIataCode(iataCode: string): Promise<IDestination | null> {
    return await this.model
      .findOne({ 
        iataCode: iataCode.toUpperCase(), 
        isActive: true 
      })
      .exec();
  }

  async findByIcaoCode(icaoCode: string): Promise<IDestination | null> {
    return await this.model
      .findOne({ 
        icaoCode: icaoCode.toUpperCase(), 
        isActive: true 
      })
      .exec();
  }

  async searchDestinations(searchTerm: string): Promise<IDestination[]> {
    return await this.model
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { municipality: { $regex: searchTerm, $options: 'i' } },
          { isoCountry: { $regex: searchTerm, $options: 'i' } },
          { iataCode: { $regex: searchTerm, $options: 'i' } }
        ],
        isActive: true
      })
      .limit(20)
      .sort({ iataCode: 1 })
      .exec();
  }

  async getActiveDestinations(): Promise<IDestination[]> {
    return await this.model
      .find({ isActive: true })
      .sort({ name: 1 })
      .exec();
  }

  async getDestinationsByCountry(countryCode: string): Promise<IDestination[]> {
    return await this.model
      .find({ 
        isoCountry: countryCode.toUpperCase(), 
        isActive: true 
      })
      .sort({ municipality: 1 })
      .exec();
  }
}
