export const GAS_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 25,
} as const;

export const BINANCE_API = {
  ETH: "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
  BTC: "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
  SOL: "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT",
} as const;
