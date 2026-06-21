import {
  ISeatLayoutRepository,
  IAircraftRepository,
  IProviderRepository,
} from "@di/file-imports-index";
import { CreateSeatLayoutDTO, SeatLayoutDetailsDTO } from "@application/dtos/seat-dtos";
import {
  validationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ICreateSeatLayoutUseCase } from "@di/file-imports-index";
import { getLayoutConfig, getValidLayouts } from "@shared/utils/seat-layout.constants";
import {
  APPLICATION_MESSAGES,
  AUTH_MESSAGES,
  AIRCRAFT_MESSAGES,
  PROVIDER_MESSAGES,
  SEAT_MESSAGES,
} from "@shared/constants/index.constants";
import { SeatMapper } from "@application/mappers/seatMapper";

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
      this._providerRepository.isProviderBlocked(providerId),
    ]);
    if (!provider) throw new NotFoundError(PROVIDER_MESSAGES.PROVIDER_NOT_FOUND);
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  }

  // ✅ return type inferred from repo — no IAircraft import needed
  private async validateAircraftOwnership(aircraftId: string, providerId: string) {
    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
    if (!aircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);
    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError(AIRCRAFT_MESSAGES.CONFIGURE_FORBIDDEN);           
    }
    return aircraft;
  }

  private validateLayoutFormat(layout: string): void {
    const validLayouts = getValidLayouts();
    if (!validLayouts.includes(layout)) {
      throw new validationError(SEAT_MESSAGES.INVALID_LAYOUT(validLayouts));     
    }
  }

  private validateCabinClass(cabinClass: string): void {
    const validClasses = ["economy", "premium_economy", "business", "first"];
    if (!validClasses.includes(cabinClass)) {
      throw new validationError(SEAT_MESSAGES.INVALID_CABIN_CLASS(validClasses)); 
    }
  }

  private async checkDuplicateLayout(aircraftId: string, cabinClass: string): Promise<void> {
    const existing = await this._seatLayoutRepository.getSeatLayoutByClass(
      aircraftId,
      cabinClass
    );
    if (existing) {
      throw new ConflictError(SEAT_MESSAGES.LAYOUT_ALREADY_EXISTS(cabinClass));  
    }
  }

  private async validateRowRanges(
    aircraftId: string,
    startRow: number,
    endRow: number
  ): Promise<void> {
    const existingLayouts =
      await this._seatLayoutRepository.getSeatLayoutsByAircraftId(aircraftId);

    for (const layout of existingLayouts) {
      const hasOverlap =
        (startRow >= layout.startRow && startRow <= layout.endRow) ||
        (endRow >= layout.startRow && endRow <= layout.endRow) ||
        (startRow <= layout.startRow && endRow >= layout.endRow);

      if (hasOverlap) {
        throw new ConflictError(
          SEAT_MESSAGES.ROW_RANGE_OVERLAP(
            startRow,
            endRow,
            layout.cabinClass,
            layout.startRow,
            layout.endRow
          )
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
        throw new validationError(SEAT_MESSAGES.WING_ROWS_OUT_OF_RANGE);        
      }
      if (wingStartRow > wingEndRow) {
        throw new validationError(SEAT_MESSAGES.WING_ROW_START_AFTER_END);      
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
          SEAT_MESSAGES.EXIT_ROW_OUT_OF_RANGE(exitRow, startRow, endRow)        
        );
      }
    }
  }

  
  private validateTotalSeatCapacity(
    aircraft: Awaited<ReturnType<IAircraftRepository["getAircraftById"]>>,
    existingLayoutsSeats: number,
    newStartRow: number,
    newEndRow: number,
    seatsPerRow: number
  ): void {
    if (!aircraft) return;

    const newLayoutSeats = (newEndRow - newStartRow + 1) * seatsPerRow;
    const projectedTotal = existingLayoutsSeats + newLayoutSeats;

    if (projectedTotal > aircraft.seatCapacity) {
      throw new validationError(
        SEAT_MESSAGES.SEAT_CAPACITY_EXCEEDED(projectedTotal, aircraft.seatCapacity) 
      );
    }
  }

  private enrichLayoutData(data: CreateSeatLayoutDTO): CreateSeatLayoutDTO & {
    seatsPerRow: number;
    columns: string[];
    aisleColumns: string[];
  } {
    const layoutConfig = getLayoutConfig(data.layout);
    if (!layoutConfig) {
      throw new validationError(SEAT_MESSAGES.LAYOUT_CONFIG_NOT_FOUND(data.layout)); 
    }

    return {
      ...data,
      seatsPerRow: layoutConfig.seatsPerRow,
      columns: layoutConfig.columns,
      aisleColumns:
        data.aisleColumns.length > 0 ? data.aisleColumns : layoutConfig.aisleColumns,
    };
  }

  async execute(
    providerId: string,
    data: CreateSeatLayoutDTO
  ): Promise<SeatLayoutDetailsDTO> {
    if (!providerId || !data.aircraftId || !data.cabinClass || !data.layout) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (!data.aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError(AIRCRAFT_MESSAGES.INVALID_AIRCRAFT_ID_FORMAT);
    }

    if (data.startRow < 1 || data.endRow < 1) {
      throw new validationError(SEAT_MESSAGES.ROW_NUMBER_MIN);                   
    }

    if (data.startRow > data.endRow) {
      throw new validationError(SEAT_MESSAGES.START_ROW_AFTER_END_ROW);         
    }

    this.validateLayoutFormat(data.layout);
    this.validateCabinClass(data.cabinClass);

    const [aircraft] = await Promise.all([
      this.validateAircraftOwnership(data.aircraftId, providerId),
      this.validateProvider(providerId),
      this.checkDuplicateLayout(data.aircraftId, data.cabinClass),
      this.validateRowRanges(data.aircraftId, data.startRow, data.endRow),
    ]);

    if (data.wingStartRow != null && data.wingEndRow != null) {
      this.validateWingRows(data.wingStartRow, data.wingEndRow, data.startRow, data.endRow);
    }

    if (data.exitRows && data.exitRows.length > 0) {
      this.validateExitRows(data.exitRows, data.startRow, data.endRow);
    }

    const enrichedData = this.enrichLayoutData(data);

    const existingLayouts =
      await this._seatLayoutRepository.getSeatLayoutsByAircraftId(data.aircraftId);

    const existingTotalSeats = existingLayouts.reduce(
      (sum, layout) => sum + (layout.endRow - layout.startRow + 1) * layout.seatsPerRow,
      0
    );

    this.validateTotalSeatCapacity(
      aircraft,
      existingTotalSeats,
      data.startRow,
      data.endRow,
      enrichedData.seatsPerRow
    );

    // ✅ entity shape built inline — enriched DTO not passed directly to repo
    const seatLayout = await this._seatLayoutRepository.createSeatLayout({
      aircraftId: enrichedData.aircraftId,
      cabinClass: enrichedData.cabinClass,
      layout: enrichedData.layout,
      startRow: enrichedData.startRow,
      endRow: enrichedData.endRow,
      totalRows: enrichedData.endRow - enrichedData.startRow + 1,
      seatsPerRow: enrichedData.seatsPerRow,
      columns: enrichedData.columns,
      aisleColumns: enrichedData.aisleColumns,
      exitRows: enrichedData.exitRows,
      ...(enrichedData.wingStartRow != null && { wingStartRow: enrichedData.wingStartRow }),
      ...(enrichedData.wingEndRow != null && { wingEndRow: enrichedData.wingEndRow }),
    });

    // / repo already re-fetches internally after save — safe to map directly
    return SeatMapper.toSeatLayoutDTO(seatLayout);
  }
}