import { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(entity: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  findOne(query: Partial<T>): Promise<T | null>;
  findMany(query: FilterQuery<T>):Promise<T[]>
  insertMany(entities: T[]): Promise<void>;
}