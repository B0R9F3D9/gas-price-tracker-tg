import type { Env } from "../types";
import { logger } from "../utils/logger";

function getBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export async function pingHealthcheckStart(env: Env): Promise<void> {
  if (!env.HEALTHCHECK_URL) return;

  try {
    const baseUrl = getBaseUrl(env.HEALTHCHECK_URL);
    logger.info("healthcheck_start_ping");
    await fetch(`${baseUrl}/start`, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GasPriceTracker/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    logger.warn("healthcheck_start_error", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function pingHealthcheckSuccess(env: Env, logBody?: string): Promise<void> {
  if (!env.HEALTHCHECK_URL) return;

  try {
    const baseUrl = getBaseUrl(env.HEALTHCHECK_URL);
    logger.info("healthcheck_success_ping");
    await fetch(baseUrl, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GasPriceTracker/1.0)",
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: logBody,
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    logger.warn("healthcheck_success_error", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function pingHealthcheckFail(env: Env, error: unknown): Promise<void> {
  if (!env.HEALTHCHECK_URL) return;

  try {
    const baseUrl = getBaseUrl(env.HEALTHCHECK_URL);
    const body =
      error instanceof Error
        ? `${error.name}: ${error.message}\n\nStack:\n${error.stack ?? ""}`
        : String(error);

    logger.info("healthcheck_fail_ping");
    await fetch(`${baseUrl}/fail`, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GasPriceTracker/1.0)",
        "Content-Type": "text/plain; charset=utf-8",
      },
      body,
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    logger.warn("healthcheck_fail_error", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
