import type { PriceData } from "../types";
import { BINANCE_API } from "../utils/constants";

export async function fetchBtcPrice(): Promise<PriceData> {
  const response = await fetch(BINANCE_API.BTC);
  const data = (await response.json()) as { price: string; symbol: string };
  return {
    price: parseFloat(data.price),
    symbol: data.symbol,
  };
}

export async function fetchSolPrice(): Promise<PriceData> {
  const response = await fetch(BINANCE_API.SOL);
  const data = (await response.json()) as { price: string; symbol: string };
  return {
    price: parseFloat(data.price),
    symbol: data.symbol,
  };
}

export async function fetchEthPrice(): Promise<PriceData> {
  const response = await fetch(BINANCE_API.ETH);
  const data = (await response.json()) as { price: string; symbol: string };
  return {
    price: parseFloat(data.price),
    symbol: data.symbol,
  };
}
