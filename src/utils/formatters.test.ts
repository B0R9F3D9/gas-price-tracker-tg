import { describe, expect, test } from "bun:test";
import { formatGas, formatMessage, formatPrice, getGasColor } from "./formatters";

describe("formatters", () => {
  test("getGasColor returns correct emoji based on thresholds", () => {
    expect(getGasColor(5)).toBe("🟩");
    expect(getGasColor(10)).toBe("🟩");
    expect(getGasColor(15)).toBe("🟨");
    expect(getGasColor(25)).toBe("🟨");
    expect(getGasColor(30)).toBe("🟥");
  });

  test("formatGas formats gwei to 2 decimal places", () => {
    expect(formatGas(0.4048)).toBe("0.40");
    expect(formatGas(12.3)).toBe("12.30");
  });

  test("formatPrice formats numbers with commas and 2 decimals in bold html", () => {
    expect(formatPrice(84670.5)).toBe("<b>$84,670.50</b>");
    expect(formatPrice(4297.6)).toBe("<b>$4,297.60</b>");
  });

  test("formatMessage formats telegram message including gas and crypto prices", () => {
    const msg = formatMessage(
      { baseFee: "0.40", baseFeeRaw: 0.40 },
      { btc: 84670.5, eth: 2721.62, sol: 121.01 }
    );

    expect(msg).toContain("🟩 0.40 - ETH Gwei⛽️");
    expect(msg).toContain("$BTC: <b>$84,670.50</b>");
    expect(msg).toContain("$ETH: <b>$2,721.62</b>");
    expect(msg).toContain("$SOL: <b>$121.01</b>");
  });
});
