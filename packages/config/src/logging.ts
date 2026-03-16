type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug: (message: string, meta?: unknown) => void;
  info: (message: string, meta?: unknown) => void;
  warn: (message: string, meta?: unknown) => void;
  error: (message: string, meta?: unknown) => void;
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta ? { message, meta } : { message };

  switch (level) {
    case "debug":
      console.debug(payload);
      break;
    case "info":
      console.info(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    case "error":
      console.error(payload);
      break;
  }
}

export const logger: Logger = {
  debug: (message, meta) => log("debug", message, meta),
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta)
};

