import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export interface IAvailableAircraftsForScheduleUsecase {

    execute(providerId: string,
    departureDestinationId: string,
    departureTimeIso: string): Promise<AircraftDetailsDTO[]>;
}
