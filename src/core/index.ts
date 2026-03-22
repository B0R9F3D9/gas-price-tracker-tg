import type { Env } from "../types";
import { fetchGasPrice } from "../services/gas";
import { fetchBtcPrice, fetchSolPrice, fetchEthPrice } from "../services/prices";
import { sendTelegramMessage } from "../services/telegram";
import { formatMessage } from "../utils/formatters";

export default {
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    try {
      const [gasData, btcPrice, solPrice, ethPrice] = await Promise.all([
        fetchGasPrice(env),
        fetchBtcPrice(),
        fetchSolPrice(),
        fetchEthPrice(),
      ]);

      const html = formatMessage(gasData, {
        btc: btcPrice.price,
        sol: solPrice.price,
        eth: ethPrice.price,
      });

      await sendTelegramMessage(html, env);

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error in scheduled handler:", error);
      throw error;
    }
  },

  async fetch(_request: Request, _env: Env): Promise<Response> {
    return new Response("ETH Gas Tracker is running. This endpoint is not meant for direct access.", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  },
} satisfies ExportedHandler<Env>;
