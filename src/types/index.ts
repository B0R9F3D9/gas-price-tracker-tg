export interface GasData {
  baseFee: string;
  baseFeeRaw: number;
}

export interface PriceData {
  price: number;
  symbol: string;
}

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode: "HTML";
}

export interface Env {
  ETHEREUM_RPC_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  ENVIRONMENT?: string;
  HEALTHCHECK_URL?: string;
}

export type CryptoSymbol = "BTC" | "ETH" | "SOL" | "GOLD";
