import type { Env } from "../types";
import { fetchGasPrice } from "../services/gas";
import { fetchBtcPrice, fetchSolPrice, fetchEthPrice } from "../services/prices";
import { sendTelegramMessage } from "../services/telegram";
import { formatMessage } from "../utils/formatters";
import { logger } from "../utils/logger";
import {
  pingHealthcheckStart,
  pingHealthcheckSuccess,
  pingHealthcheckFail,
} from "../services/healthcheck";

export default {
  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    await pingHealthcheckStart(env);

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

      logger.info("worker_run_success", {
        gas: gasData.baseFee,
        btc: btcPrice.price,
        eth: ethPrice.price,
        sol: solPrice.price,
      });

      await pingHealthcheckSuccess(
        env,
        `Gas: ${gasData.baseFee} Gwei | BTC: $${btcPrice.price} | ETH: $${ethPrice.price} | SOL: $${solPrice.price}`,
      );
    } catch (error) {
      logger.error("worker_run_error", error);
      await pingHealthcheckFail(env, error);
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
