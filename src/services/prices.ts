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

export const LIGHTER_GOLD_SOURCES = [
  {
    name: "lighter-rh",
    url: "https://api.rh.lighter.xyz/api/v1/exchangeStats",
    label: "Robinhood Lighter",
  },
  {
    name: "lighter-mainnet",
    url: "https://mainnet.zklighter.elliot.ai/api/v1/exchangeStats",
    label: "Lighter Mainnet",
  },
] as const;

export async function fetchGoldPrice(): Promise<PriceData> {
  logger.info("gold_price_fetch_start", { source: "lighter" });

  for (const source of LIGHTER_GOLD_SOURCES) {
    try {
      logger.info("gold_price_fetch_attempt", { source: source.name, url: source.url });

      const response = await fetch(source.url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; GasPriceTracker/1.0)",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        logger.warn("gold_price_fetch_failed", {
          source: source.name,
          status: response.status,
          statusText: response.statusText,
        });
        continue;
      }

      const data = (await response.json()) as any;
      if (data?.code === 200 && Array.isArray(data.order_book_stats)) {
        const xau = data.order_book_stats.find(
          (s: any) => s.symbol === "XAU" || s.symbol === "XAU-PERP"
        );
        const price = xau?.last_trade_price ? parseFloat(xau.last_trade_price) : NaN;

        if (!isNaN(price) && price > 0) {
          logger.info("gold_price_fetch_success", {
            source: source.name,
            symbol: "XAU",
            price,
          });
          return { price, symbol: "XAU" };
        }
      }

      logger.warn("gold_price_fetch_invalid_payload", { source: source.name });
    } catch (error) {
      logger.warn("gold_price_fetch_error", { source: source.name }, error);
      continue;
    }
  }

  logger.warn("gold_price_lighter_failed_using_fallback");
  return fetchPriceWithFallback("GOLD");
}
