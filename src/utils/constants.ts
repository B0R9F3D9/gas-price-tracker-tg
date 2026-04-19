export const GAS_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 25,
} as const;

export const PRICE_SOURCES = [
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
    name: "coingecko",
    urls: {
      ETH: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      BTC: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      SOL: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    },
    parsePrice: (data: any) => {
      const key = Object.keys(data)[0];
      return data[key].usd;
    },
  },
  {
    name: "cryptocompare",
    urls: {
      ETH: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
      BTC: "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD",
      SOL: "https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD",
    },
    parsePrice: (data: any) => data.USD,
  },
  {
    name: "coinbase",
    urls: {
      ETH: "https://api.coinbase.com/v2/prices/ETH-USD/spot",
      BTC: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
      SOL: "https://api.coinbase.com/v2/prices/SOL-USD/spot",
    },
    parsePrice: (data: any) => parseFloat(data.data.amount),
  },
] as const;
