import { CreateRecurringFlightDTO, RecurringFlightResultDTO } from "@application/dtos/flight-dtos";

export interface ICreateRecurringFlightUseCase {
  execute(providerId: string, data: CreateRecurringFlightDTO): Promise<RecurringFlightResultDTO>;
}