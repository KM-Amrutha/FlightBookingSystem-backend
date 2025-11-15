import { LogLevel } from "@application/dtos/logger-dtos";

export interface ILoggerUseCase {
 
  LogError(error: unknown, context?: string, message?: string): void;

  LogInfo(level: LogLevel, message: string, metadata?: object): void;
  
}