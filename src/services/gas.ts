import type { GasData, Env } from "../types";
import { ETH_RPC_SOURCES, type RpcSource } from "../utils/constants";
import { logger } from "../utils/logger";

export function getRpcSources(env?: Env): RpcSource[] {
  const sources: RpcSource[] = [];

  // If a custom RPC URL is provided in env (e.g. Alchemy, Infura, private node)
  // and is NOT the problematic publicnode, prioritize it.
  if (env?.ETHEREUM_RPC_URL && !env.ETHEREUM_RPC_URL.includes("publicnode.com")) {
    sources.push({ name: "env_rpc", url: env.ETHEREUM_RPC_URL });
  }

  for (const src of ETH_RPC_SOURCES) {
    if (!sources.some((s) => s.url === src.url)) {
      sources.push(src);
    }
  }

  // If env has publicnode or another url not yet added, add it as a fallback
  if (env?.ETHEREUM_RPC_URL && !sources.some((s) => s.url === env.ETHEREUM_RPC_URL)) {
    sources.push({ name: "env_rpc_fallback", url: env.ETHEREUM_RPC_URL });
  }

  return sources;
}

export async function fetchGasPrice(env?: Env): Promise<GasData> {
  logger.info("gas_fetch_start");

  const sources = getRpcSources(env);

  for (const source of sources) {
    try {
      logger.info("gas_fetch_attempt", { source: source.name, url: source.url });

      const response = await fetch(source.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; GasPriceTracker/1.0)",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_gasPrice",
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        logger.warn("gas_fetch_source_http_error", {
          source: source.name,
          status: response.status,
          statusText: response.statusText,
        });
        continue;
      }

      let data: any;
      try {
        data = await response.json();
      } catch {
        logger.warn("gas_fetch_json_parse_error", { source: source.name });
        continue;
      }

      if (!data || typeof data !== "object" || data.error || typeof data.result !== "string") {
        logger.warn("gas_fetch_invalid_payload", {
          source: source.name,
          error: data?.error,
          result: data?.result,
        });
        continue;
      }

      const baseFeeRaw = parseInt(data.result, 16);
      if (isNaN(baseFeeRaw) || baseFeeRaw <= 0) {
        logger.warn("gas_fetch_invalid_price", {
          source: source.name,
          hexResult: data.result,
          baseFeeRaw,
        });
        continue;
      }

      const baseFeeGwei = baseFeeRaw / 1e9;
      const baseFee = baseFeeGwei.toFixed(2);

      logger.info("gas_fetch_success", {
        source: source.name,
        baseFee,
        baseFeeRaw: baseFeeGwei,
        hexResult: data.result,
      });

      return {
        baseFee,
        baseFeeRaw: baseFeeGwei,
      };
    } catch (error) {
      logger.warn("gas_fetch_source_error", { source: source.name }, error);
      continue;
    }
  }

  const errorMsg = "All Ethereum RPC sources failed to provide gas price";
  logger.error("gas_fetch_all_failed", new Error(errorMsg));
  throw new Error(errorMsg);
}

