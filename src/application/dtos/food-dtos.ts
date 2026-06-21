// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateFoodDTO {
  aircraftId: string;
  foodName: string;
  foodType: string;
  vegNonveg: "veg" | "non-veg";
  serveMethod: string;
  isComplimentary: boolean;
  foodPrice: number;
  image?: string;  // base64 string — uploaded to Cloudinary in usecase, URL stored in DB
}

export interface UpdateFoodDTO {
  foodName?: string;
  foodType?: string;
  vegNonveg?: "veg" | "non-veg";
  serveMethod?: string;
  isComplimentary?: boolean;
  foodPrice?: number;
  image?: string;  // base64 string — if provided, uploads new image to Cloudinary
  isActive?: boolean;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface FoodResponseDTO {
  id: string;
  aircraftId: string;
  aircraftName?: string;
  providerId: string;
  foodName: string;
  foodType: string;
  vegNonveg: "veg" | "non-veg";
  serveMethod: string;
  isComplimentary: boolean;
  foodPrice: number;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedFoodResponseDTO {
  foods: FoodResponseDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}