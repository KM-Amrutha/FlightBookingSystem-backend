
export interface BaseQueryDTO {
  search: string;
  page: number;
  limit: number;
  filters: string[];
  // fromDate: Date | undefined;
  // toDate: Date | undefined;
}

// usersRelated query Dto

export type GetUsersQueryDTO = Omit <BaseQueryDTO,"fromDate" | "toDate">;


