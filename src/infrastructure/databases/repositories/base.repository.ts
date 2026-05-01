import mongoose, { Model, FilterQuery } from "mongoose";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected readonly model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  private mapId(doc: Record<string, any>): any {
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

  async create(entity: T): Promise<T> {
    const doc = await this.model.create(entity);
    return this.mapId(doc.toObject()) as T;
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) return null;
    return this.mapId(doc) as T;
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, entity, { new: true })
      .lean()
      .exec();
    if (!doc) return null;
    return this.mapId(doc) as T;
  }

  async delete(id: string): Promise<T | null> {
    const doc = await this.model
      .findByIdAndDelete({ _id: id })
      .lean()
      .exec();
    if (!doc) return null;
    return this.mapId(doc) as T;
  }

  async findOne(conditions: object): Promise<T | null> {
    const doc = await this.model.findOne(conditions).lean().exec();
    if (!doc) return null;
    return this.mapId(doc) as T;
  }

  async findMany(query: FilterQuery<T>): Promise<T[]> {
    const docs = await this.model.find(query).lean().exec();
    return docs.map((doc) => this.mapId(doc)) as T[];
  }

  async insertMany(entities: T[]): Promise<void> {
    await this.model.insertMany(entities);
  }

  parseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }
}