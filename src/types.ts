export interface GasData {
  baseFee: string;
  slow: number;
  standard: number;
  fast: number;
}

export interface EthPriceData {
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
}
