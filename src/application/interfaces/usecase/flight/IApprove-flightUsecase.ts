import {
  ApproveFlightDTO,
  FlightDetailsDTO,

} from "@application/dtos/flight-dtos";

export interface IApproveFlightUseCase {
  execute(flightId: string, data: ApproveFlightDTO): Promise<FlightDetailsDTO>;
}
