import type { Env } from "../types";
import { fetchGasPrice } from "../services/gas";
import { fetchBtcPrice, fetchSolPrice, fetchEthPrice } from "../services/prices";
import { sendTelegramMessage } from "../services/telegram";
import { formatMessage } from "../utils/formatters";
import { logger } from "../utils/logger";

export default {
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    logger.info("worker_run_start");

    try {
      const [gasData, btcPrice, solPrice, ethPrice] = await Promise.all([
        fetchGasPrice(env),
        fetchBtcPrice(),
        fetchSolPrice(),
        fetchEthPrice(),
      ]);

      logger.info("data_fetched", {
        gas: {
          baseFee: gasData.baseFee,
          baseFeeRaw: gasData.baseFeeRaw,
        },
        prices: {
          BTC: btcPrice.price,
          SOL: solPrice.price,
          ETH: ethPrice.price,
        },
      });

      const html = formatMessage(gasData, {
        btc: btcPrice.price,
        sol: solPrice.price,
        eth: ethPrice.price,
      });

      await sendTelegramMessage(html, env);

      logger.info("worker_run_success", {
        messageLength: html.length,
      });
    } catch (error) {
      logger.error("worker_run_error", error);
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
