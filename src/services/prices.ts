import type { PriceData } from "../types";
import { BINANCE_API } from "../utils/constants";
import { logger } from "../utils/logger";

export async function fetchBtcPrice(): Promise<PriceData> {
  logger.info("price_fetch_start", { symbol: "BTC", source: "binance" });

  try {
    const response = await fetch(BINANCE_API.BTC);

    if (!response.ok) {
      throw new Error(`Binance response not OK: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { price: string; symbol: string };
    const price = parseFloat(data.price);

    logger.info("price_fetch_success", { symbol: "BTC", source: "binance", price });

    return { price, symbol: data.symbol };
  } catch (error) {
    logger.error("price_fetch_error", error, { symbol: "BTC", source: "binance" });
    throw error;
  }
}

export async function fetchSolPrice(): Promise<PriceData> {
  logger.info("price_fetch_start", { symbol: "SOL", source: "binance" });

  try {
    const response = await fetch(BINANCE_API.SOL);

    if (!response.ok) {
      throw new Error(`Binance response not OK: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { price: string; symbol: string };
    const price = parseFloat(data.price);

    logger.info("price_fetch_success", { symbol: "SOL", source: "binance", price });

    return { price, symbol: data.symbol };
  } catch (error) {
    logger.error("price_fetch_error", error, { symbol: "SOL", source: "binance" });
    throw error;
  }
}

export async function fetchEthPrice(): Promise<PriceData> {
  logger.info("price_fetch_start", { symbol: "ETH", source: "binance" });

  try {
    const response = await fetch(BINANCE_API.ETH);

    if (!response.ok) {
      throw new Error(`Binance response not OK: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { price: string; symbol: string };
    const price = parseFloat(data.price);

    logger.info("price_fetch_success", { symbol: "ETH", source: "binance", price });

    return { price, symbol: data.symbol };
  } catch (error) {
    logger.error("price_fetch_error", error, { symbol: "ETH", source: "binance" });
    throw error;
  }
}
