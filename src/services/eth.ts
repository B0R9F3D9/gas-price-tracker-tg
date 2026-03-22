import type { GasData, EthPriceData, Env } from "../types";

export async function fetchGasPrice(env: Env): Promise<GasData> {
  const response = await fetch(env.ETHEREUM_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_gasPrice",
      params: [],
      id: 1,
    }),
  });

  const data = (await response.json()) as { result: string };
  const baseFee = parseInt(data.result, 16);

  const slow = Math.round(baseFee * 0.8);
  const standard = baseFee;
  const fast = Math.round(baseFee * 1.2);

  return {
    baseFee: (baseFee / 1e9).toFixed(2),
    slow: slow / 1e9,
    standard: standard / 1e9,
    fast: fast / 1e9,
  };
}

export async function fetchEthPrice(): Promise<EthPriceData> {
  const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
  const data = (await response.json()) as { price: string; symbol: string };
  return {
    price: parseFloat(data.price),
    symbol: data.symbol,
  };
}
