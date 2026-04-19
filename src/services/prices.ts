import type { PriceData } from "../types";
import { PRICE_SOURCES } from "../utils/constants";
import { logger } from "../utils/logger";

type CryptoSymbol = "BTC" | "ETH" | "SOL";

async function fetchPriceWithFallback(symbol: CryptoSymbol): Promise<PriceData> {
  logger.info("price_fetch_start", { symbol });

  for (const source of PRICE_SOURCES) {
    try {
      const url = source.urls[symbol];
      logger.info("price_fetch_attempt", { symbol, source: source.name, url });

      const response = await fetch(url);

      if (!response.ok) {
        logger.warn("price_fetch_source_failed", {
          symbol,
          source: source.name,
          status: response.status,
          statusText: response.statusText,
        });
        continue;
      }

      const data = await response.json();
      const price = source.parsePrice(data);

      if (price === undefined || price === null || isNaN(price)) {
        logger.warn("price_fetch_invalid_price", {
          symbol,
          source: source.name,
          price,
          data,
        });
        continue;
      }

      logger.info("price_fetch_success", { symbol, source: source.name, price });

      return { price, symbol: `${symbol}USDT` };
    } catch (error) {
      logger.warn("price_fetch_source_error", error, { symbol, source: source.name });
      continue;
    }
  }

  const errorMsg = `All price sources failed for ${symbol}`;
  logger.error("price_fetch_all_failed", new Error(errorMsg), { symbol });
  throw new Error(errorMsg);
}

export async function fetchBtcPrice(): Promise<PriceData> {
  return fetchPriceWithFallback("BTC");
}

export async function fetchSolPrice(): Promise<PriceData> {
  return fetchPriceWithFallback("SOL");
}

export async function fetchEthPrice(): Promise<PriceData> {
  return fetchPriceWithFallback("ETH");
}
