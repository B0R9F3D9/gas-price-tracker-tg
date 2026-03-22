import type { Env } from "./types";
import { fetchGasPrice, fetchEthPrice } from "./services/eth";
import { sendTelegramMessage } from "./services/telegram";

function formatMessage(
  gasData: { baseFee: string; slow: number; standard: number; fast: number },
  ethPrice: number,
): string {
  return `<b>⛽ ETH Gas Tracker</b>

💰 ETH Price: <code>$${ethPrice.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}</code>

⏱️ Gas Prices (Gwei):
  🐢 Slow:   <code>${gasData.slow.toFixed(2)}</code>
  🐇 Standard: <code>${gasData.standard.toFixed(2)}</code>
  🚀 Fast:   <code>${gasData.fast.toFixed(2)}</code>
`;
}

export default {
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    try {
      const [gasData, ethPriceData] = await Promise.all([fetchGasPrice(env), fetchEthPrice()]);

      const html = formatMessage(gasData, ethPriceData.price);
      await sendTelegramMessage(html, env);

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error in scheduled handler:", error);
      throw error;
    }
  },

  async fetch(_request: Request, _env: Env): Promise<Response> {
    return new Response(
      "ETH Gas Tracker is running. This endpoint is not meant for direct access.",
      {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      },
    );
  },
} satisfies ExportedHandler<Env>;
