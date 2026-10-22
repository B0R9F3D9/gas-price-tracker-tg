import type { PriceData, CryptoSymbol } from "../types";
import { PRICE_SOURCES } from "../utils/constants";
import { logger } from "../utils/logger";

async function fetchPriceWithFallback(symbol: CryptoSymbol): Promise<PriceData> {
  logger.info("price_fetch_start", { symbol });

  for (const source of PRICE_SOURCES) {
    try {
      const url = source.urls[symbol];
      logger.info("price_fetch_attempt", { symbol, source: source.name, url });

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GasPriceTracker/1.0)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        if (response.status === 429) {
          logger.warn("price_fetch_rate_limited", {
            symbol,
            source: source.name,
            status: response.status,
          });
        } else {
          logger.warn("price_fetch_source_failed", {
            symbol,
            source: source.name,
            status: response.status,
            statusText: response.statusText,
          });
        }
        continue;
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        logger.warn("price_fetch_json_parse_error", {
          symbol,
          source: source.name,
        });
        continue;
      }

      let price: number;
      try {
        price = source.parsePrice(data);
      } catch (parseErr) {
        logger.warn(
          "price_fetch_parse_error",
          { symbol, source: source.name },
          parseErr,
        );
        continue;
      }

      if (price === undefined || price === null || isNaN(price) || price <= 0) {
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
      logger.warn("price_fetch_source_error", { symbol, source: source.name }, error);
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
