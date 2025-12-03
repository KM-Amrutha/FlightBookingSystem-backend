import { 
  ISeatRepository,
  ISeatLayoutRepository,
  ISeatTypeRepository,
  IAircraftRepository,
  IProviderRepository
} from "@di/file-imports-index";
import { SeatDetailsDTO, CreateSeatDTO } from "@application/dtos/seat-dtos";
import { validationError, NotFoundError, ForbiddenError, ConflictError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGenerateSeatsUseCase } from "@di/file-imports-index";
import { getLayoutConfig } from "@shared/utils/seat-layout.constants";
import { ApplicationStatus, AuthStatus,ProviderStatus, AircraftStatus } from "@shared/constants/index.constants";

@injectable()
export class GenerateSeatsUseCase implements IGenerateSeatsUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatRepository)
    private _seatRepository: ISeatRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatLayoutRepository)
    private _seatLayoutRepository: ISeatLayoutRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatTypeRepository)
    private _seatTypeRepository: ISeatTypeRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  private async validateProvider(providerId: string): Promise<void> {
    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId)
    ]);

    if (!provider) {
      throw new NotFoundError(ProviderStatus.ProviderNotFound);
    }

    if (isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }

    if (!provider.isVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
  }

  private async validateAircraftOwnership(
    aircraftId: string,
    providerId: string
  ): Promise<void> {
    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);

    if (!aircraft) {
      throw new NotFoundError(AircraftStatus.NotFound);
    }

    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError("You don't have permission to generate seats for this aircraft");
    }
  }

  private async checkExistingSeats(aircraftId: string): Promise<void> {
    const existingSeats = await this._seatRepository.getSeatsByAircraftId(aircraftId);

    if (existingSeats.length > 0) {
      throw new ConflictError(
        `Seats already exist for this aircraft (${existingSeats.length} seats found). ` +
        `Delete existing seats first if you want to regenerate.`
      );
    }
  }

  private async validateSeatLayouts(aircraftId: string): Promise<void> {
    const layouts = await this._seatLayoutRepository.getSeatLayoutsByAircraftId(aircraftId);

    if (layouts.length === 0) {
      throw new validationError(
        "No seat layouts found. Create seat layouts first before generating seats."
      );
    }
  }

  private determineSection(
    rowNumber: number,
    totalRows: number,
    wingStartRow: number,
    wingEndRow: number
  ): string {
    // If wing rows are defined and row is within wing area
    if (wingStartRow > 0 && wingEndRow > 0) {
      if (rowNumber >= wingStartRow && rowNumber <= wingEndRow) {
        return "overwing";
      }
    }

    // Divide aircraft into three sections
    const frontSection = Math.ceil(totalRows * 0.33);
    const rearSection = Math.floor(totalRows * 0.67);

    if (rowNumber <= frontSection) {
      return "front";
    } else if (rowNumber > rearSection) {
      return "rear";
    } else {
      return "middle";
    }
  }

  private getPositionForColumn(layout: string, column: string): string {
    const layoutConfig = getLayoutConfig(layout);
    
    if (!layoutConfig) {
      return "middle"; 
    }

    return layoutConfig.positions[column] || "middle";
  }

  private getSeatFeatures(
    isExitRow: boolean,
    position: string,
    cabinClass: string
  ): string[] {
    const features: string[] = [];

    // Exit row features
    if (isExitRow) {
      features.push("extra-legroom", "exit-row");
    }

    // Position-based features
    if (position === "window") {
      features.push("window-view");
    }

    // Class-based features
    if (cabinClass === "business" || cabinClass === "first") {
      features.push("premium-service", "priority-boarding");
    }

    if (cabinClass === "premium_economy") {
      features.push("extra-space");
    }

    return features;
  }

  private async generateSeatsForLayout(
    aircraftId: string,
    layout: any,
    seatTypeId: string,
    totalAircraftRows: number
  ): Promise<CreateSeatDTO[]> {
    const seats: CreateSeatDTO[] = [];
    const layoutConfig = getLayoutConfig(layout.layout);

    if (!layoutConfig) {
      throw new validationError(`Invalid layout configuration: ${layout.layout}`);
    }

    // Generate seats for each row in this layout
    for (let row = layout.startRow; row <= layout.endRow; row++) {
      const isExitRow = layout.exitRows.includes(row);
      const section = this.determineSection(
        row,
        totalAircraftRows,
        layout.wingStartRow,
        layout.wingEndRow
      );

      // Generate seats for each column in this row
      for (const column of layout.columns) {
        const position = this.getPositionForColumn(layout.layout, column);
        const seatNumber = `${row}${column}`;
        const features = this.getSeatFeatures(isExitRow, position, layout.cabinClass);

        seats.push({
          aircraftId,
          seatTypeId,
          seatNumber,
          rowNumber: row,
          columnPosition: column,
          section,
          position,
          isExitRow,
          isBlocked: false,
          features
        });
      }
    }

    return seats;
  }

  private calculateTotalRows(layouts: any[]): number {
    if (layouts.length === 0) return 0;
    return Math.max(...layouts.map(layout => layout.endRow));
  }

  async execute(
    providerId: string,
    aircraftId: string
  ): Promise<SeatDetailsDTO[]> {
    if (!providerId || !aircraftId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (!aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid aircraft ID format");
    }

    await Promise.all([
      this.validateProvider(providerId),
      this.validateAircraftOwnership(aircraftId, providerId),
      this.checkExistingSeats(aircraftId),
      this.validateSeatLayouts(aircraftId)
    ]);

    const layouts = await this._seatLayoutRepository.getSeatLayoutsByAircraftId(aircraftId);
    const totalAircraftRows = this.calculateTotalRows(layouts);

    const allSeats: CreateSeatDTO[] = [];

    // Generate seats for each cabin class layout
    for (const layout of layouts) {
      const seatType = await this._seatTypeRepository.getSeatTypeByClass(layout.cabinClass);

      if (!seatType) {
        throw new NotFoundError(`Seat type not found for class: ${layout.cabinClass}`);
      }

      const layoutSeats = await this.generateSeatsForLayout(
        aircraftId,
        layout,
        seatType._id,
        totalAircraftRows
      );

      allSeats.push(...layoutSeats);
    }

    if (allSeats.length === 0) {
      throw new validationError("No seats generated. Check your layout configuration.");
    }

    try {
      const createdSeats = await this._seatRepository.createSeats(allSeats);
      return createdSeats;
    } catch (error) {
      if (
        error instanceof validationError ||
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof ConflictError
      ) {
        throw error;
      }
      throw new validationError("Failed to generate seats");
    }
  }
}
