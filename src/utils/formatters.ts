import { GAS_THRESHOLDS } from "./constants";

export function getGasColor(gwei: number): string {
  if (gwei <= GAS_THRESHOLDS.LOW) return "🟩";
  if (gwei <= GAS_THRESHOLDS.MEDIUM) return "🟨";
  return "🟥";
}

export function formatGas(gwei: number): string {
  return gwei.toFixed(2);
}

export function formatPrice(price: number): string {
  return (
    "<b>" +
    "$" +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    "</b>"
  );
}

export function formatMessage(
  gasData: { baseFee: string; baseFeeRaw: number },
  prices: { btc: number; sol: number; eth: number },
): string {
  const color = getGasColor(gasData.baseFeeRaw);
  const gas = formatGas(gasData.baseFeeRaw);

  return `${color} ${gas} - ETH Gwei⛽️

$BTC: ${formatPrice(prices.btc)}
$ETH: ${formatPrice(prices.eth)}
$SOL: ${formatPrice(prices.sol)}
`;
}
