import { 
  ISeatLayoutRepository,
  IAircraftRepository,
  IProviderRepository
} from "@di/file-imports-index";
import { CreateSeatLayoutDTO, SeatLayoutDetailsDTO } from "@application/dtos/seat-dtos";
import { validationError, NotFoundError, ForbiddenError, ConflictError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ICreateSeatLayoutUseCase } from "@di/file-imports-index";
import { getLayoutConfig, getValidLayouts } from "@shared/utils/seat-layout.constants";
import { ApplicationStatus, AuthStatus, AircraftStatus,ProviderStatus } from "@shared/constants/index.constants";

@injectable()
export class CreateSeatLayoutUseCase implements ICreateSeatLayoutUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatLayoutRepository)
    private _seatLayoutRepository: ISeatLayoutRepository,
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
      throw new ForbiddenError("You don't have permission to configure this aircraft");
    }
  }

  private validateLayoutFormat(layout: string): void {
    const validLayouts = getValidLayouts();
    
    if (!validLayouts.includes(layout)) {
      throw new validationError(
        `Invalid layout. Valid layouts: ${validLayouts.join(", ")}`
      );
    }
  }

  private validateCabinClass(cabinClass: string): void {
    const validClasses = ["economy", "premium_economy", "business", "first"];
    
    if (!validClasses.includes(cabinClass)) {
      throw new validationError(
        `Invalid cabin class. Valid classes: ${validClasses.join(", ")}`
      );
    }
  }

  private async checkDuplicateLayout(
    aircraftId: string,
    cabinClass: string
  ): Promise<void> {
    const existingLayout = await this._seatLayoutRepository.getSeatLayoutByClass(
      aircraftId,
      cabinClass
    );

    if (existingLayout) {
      throw new ConflictError(
        `Seat layout for ${cabinClass} class already exists for this aircraft`
      );
    }
  }

  private async validateRowRanges(
    aircraftId: string,
    startRow: number,
    endRow: number
  ): Promise<void> {
    const existingLayouts = await this._seatLayoutRepository.getSeatLayoutsByAircraftId(
      aircraftId
    );

    for (const layout of existingLayouts) {
      const hasOverlap = (
        (startRow >= layout.startRow && startRow <= layout.endRow) ||
        (endRow >= layout.startRow && endRow <= layout.endRow) ||
        (startRow <= layout.startRow && endRow >= layout.endRow)
      );

      if (hasOverlap) {
        throw new ConflictError(
          `Row range ${startRow}-${endRow} overlaps with existing ${layout.cabinClass} layout (rows ${layout.startRow}-${layout.endRow})`
        );
      }
    }
  }

  private validateWingRows(
    wingStartRow: number,
    wingEndRow: number,
    startRow: number,
    endRow: number
  ): void {
    if (wingStartRow > 0 && wingEndRow > 0) {
      if (wingStartRow < startRow || wingEndRow > endRow) {
        throw new validationError(
          "Wing rows must be within the layout row range"
        );
      }

      if (wingStartRow > wingEndRow) {
        throw new validationError(
          "Wing start row cannot be greater than wing end row"
        );
      }
    }
  }

  private validateExitRows(
    exitRows: number[],
    startRow: number,
    endRow: number
  ): void {
    for (const exitRow of exitRows) {
      if (exitRow < startRow || exitRow > endRow) {
        throw new validationError(
          `Exit row ${exitRow} is outside the layout row range ${startRow}-${endRow}`
        );
      }
    }
  }

  private enrichLayoutData(data: CreateSeatLayoutDTO): CreateSeatLayoutDTO {
    const layoutConfig = getLayoutConfig(data.layout);

    if (!layoutConfig) {
      throw new validationError(`Layout configuration not found for ${data.layout}`);
    }

    return {
      ...data,
      seatsPerRow: layoutConfig.seatsPerRow,
      columns: layoutConfig.columns,
      aisleColumns: data.aisleColumns.length > 0 ? data.aisleColumns : layoutConfig.aisleColumns,
     
    };
  }

  async execute(
    providerId: string,
    data: CreateSeatLayoutDTO
  ): Promise<SeatLayoutDetailsDTO> {
    if (!providerId || !data.aircraftId || !data.cabinClass || !data.layout) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (!data.aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid aircraft ID format");
    }

    if (data.startRow < 1 || data.endRow < 1) {
      throw new validationError("Row numbers must be at least 1");
    }

    if (data.startRow > data.endRow) {
      throw new validationError("Start row cannot be greater than end row");
    }

    this.validateLayoutFormat(data.layout);
    this.validateCabinClass(data.cabinClass);

    await Promise.all([
      this.validateProvider(providerId),
      this.validateAircraftOwnership(data.aircraftId, providerId),
      this.checkDuplicateLayout(data.aircraftId, data.cabinClass),
      this.validateRowRanges(data.aircraftId, data.startRow, data.endRow)
    ]);

    if (data.wingStartRow && data.wingEndRow) {
      this.validateWingRows(
        data.wingStartRow,
        data.wingEndRow,
        data.startRow,
        data.endRow
      );
    }

    if (data.exitRows && data.exitRows.length > 0) {
      this.validateExitRows(data.exitRows, data.startRow, data.endRow);
    }

    const enrichedData = this.enrichLayoutData(data);

    try {
      const seatLayout = await this._seatLayoutRepository.createSeatLayout(enrichedData);
      return seatLayout;
    } catch (error:any) {
      console.error("🚨 REAL SEAT LAYOUT ERROR:", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    mongooseErrors: error.errors
  });
      if (
        error instanceof validationError ||
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof ConflictError
      ) {
        throw error;
      }
      throw new validationError("Failed to create seat layout");
    }
  }
}
