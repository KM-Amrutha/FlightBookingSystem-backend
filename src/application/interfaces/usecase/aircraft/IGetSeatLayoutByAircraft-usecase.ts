export interface IGetSeatLayoutsByAircraftUseCase {
  execute(aircraftId: string): Promise<any[]>;
}
