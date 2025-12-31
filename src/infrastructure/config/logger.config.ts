import { createLogger, transports, format, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const { combine, timestamp, errors, json, colorize, printf } = format;

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const isDev = process.env.NODE_ENV !== "production";

const devFormat = combine(
  colorize(),
  timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

// Daily rotating file transport (replaces rotating-file-stream)
const dailyRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, "app-%DATE%.log"), // e.g., app-2025-12-26.log
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,     // gzip old files
  maxSize: "20m",          // optional: rotate also by size
  maxFiles: "14d",         // keep last 14 days
  level: isDev ? "debug" : "info",
});

export const createWinstonLogger = (): Logger => {
  const loggerTransports: any[] = [dailyRotateTransport];

  if (isDev) {
    // In dev: only show errors/warns in terminal (clean!)
    loggerTransports.push(
      new transports.Console({
        level: "error", // change to "warn" or "info" if you want more
        format: devFormat,
      })
    );
  } else {
    // In prod: JSON to console too (for Docker/CloudWatch)
    loggerTransports.push(
      new transports.Console({
        format: prodFormat,
      })
    );
  }

  return createLogger({
    level: isDev ? "debug" : "info",
    format: isDev ? devFormat : prodFormat,
    defaultMeta: { service: "airticketbooking-backend" },
    transports: loggerTransports,
  });
};