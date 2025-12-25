import {
  FlightDetailsDTO,

} from "@application/dtos/flight-dtos";


export interface IPendingFlightsForApprovalUseCase {
  execute(): Promise<FlightDetailsDTO[]>;
}
