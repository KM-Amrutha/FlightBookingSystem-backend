export interface IFood {
  id: string;
  aircraftId: string;
  providerId: string;
  foodName: string;
  foodType: string;
  vegNonveg: "veg" | "non-veg";
  serveMethod: string;
  isComplimentary: boolean;
  foodPrice: number;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}