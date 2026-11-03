type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  event: string;
  [key: string]: unknown;
}

function log(
  level: LogLevel,
  event: string,
  data: Record<string, unknown> = {},
  error?: unknown,
): void {
  const entry: LogEntry = {
    level,
    timestamp: new Date().toISOString(),
    event,
    ...data,
  };

  if (error instanceof Error) {
    entry.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (event: string, data?: Record<string, unknown>) => log("info", event, data),
  error: (event: string, error: unknown, data?: Record<string, unknown>) =>
    log("error", event, data, error),
  warn: (event: string, data?: Record<string, unknown>, error?: unknown) =>
    log("warn", event, data, error),
};
