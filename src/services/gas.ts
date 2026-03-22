import type { GasData, Env } from "../types";

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
  const baseFeeRaw = parseInt(data.result, 16);

  return {
    baseFee: (baseFeeRaw / 1e9).toFixed(2),
    baseFeeRaw: baseFeeRaw / 1e9,
  };
}
