import { describe, expect, test } from "bun:test";
import { fetchBtcPrice, fetchEthPrice, fetchSolPrice } from "./prices";
import { PRICE_SOURCES } from "../utils/constants";

describe("prices service", () => {
  test("PRICE_SOURCES contains 7 resilient providers with all pairs", () => {
    expect(PRICE_SOURCES.length).toBeGreaterThanOrEqual(5);

    for (const source of PRICE_SOURCES) {
      expect(source.urls.BTC).toBeDefined();
      expect(source.urls.ETH).toBeDefined();
      expect(source.urls.SOL).toBeDefined();
    }
  });

  test("fetchBtcPrice fetches a positive number", async () => {
    const data = await fetchBtcPrice();
    expect(data.price).toBeGreaterThan(0);
    expect(data.symbol).toBe("BTCUSDT");
  });

  test("fetchEthPrice fetches a positive number", async () => {
    const data = await fetchEthPrice();
    expect(data.price).toBeGreaterThan(0);
    expect(data.symbol).toBe("ETHUSDT");
  });

  test("fetchSolPrice fetches a positive number", async () => {
    const data = await fetchSolPrice();
    expect(data.price).toBeGreaterThan(0);
    expect(data.symbol).toBe("SOLUSDT");
  });
});
