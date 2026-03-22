import type { GasData, Env } from "../types";
import { logger } from "../utils/logger";

export async function fetchGasPrice(env: Env): Promise<GasData> {
  logger.info("gas_fetch_start", { source: "ethereum_rpc" });

  try {
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

    if (!response.ok) {
      throw new Error(`RPC response not OK: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { result: string };
    const baseFeeRaw = parseInt(data.result, 16);
    const baseFee = (baseFeeRaw / 1e9).toFixed(2);

    logger.info("gas_fetch_success", {
      source: "ethereum_rpc",
      baseFee,
      baseFeeRaw,
      hexResult: data.result,
    });

    return {
      baseFee,
      baseFeeRaw: baseFeeRaw / 1e9,
    };
  } catch (error) {
    logger.error("gas_fetch_error", error, { source: "ethereum_rpc" });
    throw error;
  }
}
