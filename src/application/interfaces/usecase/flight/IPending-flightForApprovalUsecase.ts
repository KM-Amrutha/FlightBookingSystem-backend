import {
  FlightListDTO,

} from "@application/dtos/flight-dtos";


export interface IPendingFlightsForApprovalUseCase {
  execute(): Promise<FlightListDTO[]>;
}
