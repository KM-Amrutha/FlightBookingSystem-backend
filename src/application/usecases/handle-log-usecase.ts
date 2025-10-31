import { inject,injectable } from "inversify";
import { ILoggerService } from "@application/interfaces/service/logging/ILogger.service";
import { LogLevel } from "@application/dtos/logger-dtos";
import { TYPES_SERVICES } from "@di/types-services";
import { ILoggerUseCase } from "@application/interfaces/usecase/ILogger-usecase";

@injectable()
export class LoggerUseCase implements ILoggerUseCase {
  constructor(
    @inject(TYPES_SERVICES.LoggerService)
    private _logger: ILoggerService
  ) {}

  LogError(error: unknown, context: string = "Error", message?: string): void {
    const errorMessage = message || "An error occurred";

    if (error instanceof Error) { 
      this._logger.error(
        `[${context}] ${errorMessage}: ${error.message}\n${error.stack}`
      );
    } else {
      this._logger.error(`[${context}] ${errorMessage}: Unknown error`);
    }
  }

  LogInfo(level: LogLevel, message: string, metadata: object = {}): void {
    this._logger[level](`${message} ${JSON.stringify(metadata)}`);
  }
}
