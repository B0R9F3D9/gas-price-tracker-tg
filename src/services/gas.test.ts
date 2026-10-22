import { describe, expect, test, mock } from "bun:test";
import { fetchGasPrice, getRpcSources } from "./gas";
import { ETH_RPC_SOURCES } from "../utils/constants";
import type { Env } from "../types";

describe("gas service", () => {
  test("ETH_RPC_SOURCES contains at least 4 providers", () => {
    expect(ETH_RPC_SOURCES.length).toBeGreaterThanOrEqual(4);
    for (const source of ETH_RPC_SOURCES) {
      expect(source.name).toBeDefined();
      expect(source.url.startsWith("https://")).toBe(true);
    }
  });

  test("getRpcSources prioritizes custom RPC and handles publicnode", () => {
    const customEnv: Env = {
      ETHEREUM_RPC_URL: "https://my-custom-node.example.com",
      TELEGRAM_BOT_TOKEN: "token",
      TELEGRAM_CHAT_ID: "chat",
    };
    const sourcesWithCustom = getRpcSources(customEnv);
    expect(sourcesWithCustom[0]?.url).toBe("https://my-custom-node.example.com");

    const publicNodeEnv: Env = {
      ETHEREUM_RPC_URL: "https://ethereum-rpc.publicnode.com",
      TELEGRAM_BOT_TOKEN: "token",
      TELEGRAM_CHAT_ID: "chat",
    };
    const sourcesWithPublicNode = getRpcSources(publicNodeEnv);
    expect(sourcesWithPublicNode[0]?.name).not.toBe("env_rpc");
    expect(sourcesWithPublicNode.some((s) => s.url === "https://ethereum-rpc.publicnode.com")).toBe(true);
  });

  test("fetchGasPrice fetches real gas price", async () => {
    const data = await fetchGasPrice();
    expect(data.baseFee).toBeDefined();
    expect(data.baseFeeRaw).toBeGreaterThan(0);
    expect(parseFloat(data.baseFee)).toBeGreaterThan(0);
  });

  test("fetchGasPrice falls back when primary source returns 524", async () => {
    let callCount = 0;
    const originalFetch = globalThis.fetch;

    globalThis.fetch = mock(async (url: string | URL | Request) => {
      callCount++;
      if (callCount === 1) {
        return new Response("Origin Timeout", { status: 524, statusText: "" });
      }
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: "0x4dd5ecf8",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as any;

    try {
      const data = await fetchGasPrice();
      expect(callCount).toBe(2);
      expect(parseFloat(data.baseFee)).toBeGreaterThan(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("fetchGasPrice throws when all sources fail", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = mock(async () => {
      return new Response("Error", { status: 500, statusText: "Internal Error" });
    }) as any;

    try {
      await expect(fetchGasPrice()).rejects.toThrow("All Ethereum RPC sources failed");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
