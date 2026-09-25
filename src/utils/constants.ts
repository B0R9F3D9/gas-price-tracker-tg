import type { CryptoSymbol } from "../types";

export const GAS_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 25,
} as const;

export interface PriceSource {
  name: string;
  urls: Record<CryptoSymbol, string>;
  parsePrice: (data: any) => number;
}

export const PRICE_SOURCES: readonly PriceSource[] = [
  {
    name: "okx",
    urls: {
      BTC: "https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT",
      ETH: "https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT",
      SOL: "https://www.okx.com/api/v5/market/ticker?instId=SOL-USDT",
      GOLD: "https://www.okx.com/api/v5/market/ticker?instId=PAXG-USDT",
    },
    parsePrice: (data: any) => {
      const val = data?.data?.[0]?.last;
      return val ? parseFloat(val) : NaN;
    },
  },
  {
    name: "binance",
    urls: {
      BTC: "https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT",
      ETH: "https://data-api.binance.vision/api/v3/ticker/price?symbol=ETHUSDT",
      SOL: "https://data-api.binance.vision/api/v3/ticker/price?symbol=SOLUSDT",
      GOLD: "https://data-api.binance.vision/api/v3/ticker/price?symbol=PAXGUSDT",
    },
    parsePrice: (data: any) => parseFloat(data?.price),
  },
  {
    name: "kucoin",
    urls: {
      BTC: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT",
      ETH: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-USDT",
      SOL: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=SOL-USDT",
      GOLD: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=PAXG-USDT",
    },
    parsePrice: (data: any) => parseFloat(data?.data?.price),
  },
  {
    name: "gateio",
    urls: {
      BTC: "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=BTC_USDT",
      ETH: "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=ETH_USDT",
      SOL: "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=SOL_USDT",
      GOLD: "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=PAXG_USDT",
    },
    parsePrice: (data: any) => parseFloat(data?.[0]?.last),
  },
  {
    name: "coinbase",
    urls: {
      BTC: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
      ETH: "https://api.coinbase.com/v2/prices/ETH-USD/spot",
      SOL: "https://api.coinbase.com/v2/prices/SOL-USD/spot",
      GOLD: "https://api.coinbase.com/v2/prices/PAXG-USD/spot",
    },
    parsePrice: (data: any) => parseFloat(data?.data?.amount),
  },
  {
    name: "bitget",
    urls: {
      BTC: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=BTCUSDT",
      ETH: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=ETHUSDT",
      SOL: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=SOLUSDT",
      GOLD: "https://api.bitget.com/api/v2/spot/market/tickers?symbol=PAXGUSDT",
    },
    parsePrice: (data: any) => parseFloat(data?.data?.[0]?.lastPr),
  },
  {
    name: "kraken",
    urls: {
      BTC: "https://api.kraken.com/0/public/Ticker?pair=XBTUSD",
      ETH: "https://api.kraken.com/0/public/Ticker?pair=ETHUSD",
      SOL: "https://api.kraken.com/0/public/Ticker?pair=SOLUSD",
      GOLD: "https://api.kraken.com/0/public/Ticker?pair=PAXGUSD",
    },
    parsePrice: (data: any) => {
      if (!data?.result || typeof data.result !== "object") return NaN;
      const keys = Object.keys(data.result);
      if (keys.length === 0) return NaN;
      const pair = keys[0];
      if (!pair) return NaN;
      const closePrice = data.result[pair]?.c?.[0];
      return closePrice ? parseFloat(closePrice) : NaN;
    },
  },
] as const;
