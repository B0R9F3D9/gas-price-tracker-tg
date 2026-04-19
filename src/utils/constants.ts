export const GAS_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 25,
} as const;

export const PRICE_SOURCES = [
  {
    name: "coinbase",
    urls: {
      ETH: "https://api.coinbase.com/v2/prices/ETH-USD/spot",
      BTC: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
      SOL: "https://api.coinbase.com/v2/prices/SOL-USD/spot",
    },
    parsePrice: (data: any) => parseFloat(data.data.amount),
  },
  {
    name: "binance",
    urls: {
      ETH: "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
      BTC: "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
      SOL: "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT",
    },
    parsePrice: (data: any) => parseFloat(data.price),
  },
  {
    name: "kraken",
    urls: {
      ETH: "https://api.kraken.com/0/public/Ticker?pair=ETHUSD",
      BTC: "https://api.kraken.com/0/public/Ticker?pair=XBTUSD",
      SOL: "https://api.kraken.com/0/public/Ticker?pair=SOLUSD",
    },
    parsePrice: (data: any) => {
      const pair = Object.keys(data.result)[0];
      return parseFloat(data.result[pair].c[0]);
    },
  },
  {
    name: "mexc",
    urls: {
      ETH: "https://api.mexc.com/api/v3/ticker/price?symbol=ETHUSDT",
      BTC: "https://api.mexc.com/api/v3/ticker/price?symbol=BTCUSDT",
      SOL: "https://api.mexc.com/api/v3/ticker/price?symbol=SOLUSDT",
    },
    parsePrice: (data: any) => parseFloat(data.price),
  },
  {
    name: "bybit",
    urls: {
      ETH: "https://api.bybit.com/v5/market/tickers?category=spot&symbol=ETHUSDT",
      BTC: "https://api.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT",
      SOL: "https://api.bybit.com/v5/market/tickers?category=spot&symbol=SOLUSDT",
    },
    parsePrice: (data: any) => parseFloat(data.result.list[0].lastPrice),
  },
] as const;
