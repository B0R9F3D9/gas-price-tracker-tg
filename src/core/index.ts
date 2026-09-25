import type { Env } from "../types";
import { fetchGasPrice } from "../services/gas";
import { fetchBtcPrice, fetchSolPrice, fetchEthPrice, fetchGoldPrice } from "../services/prices";
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
    logger.info("worker_run_start");
    await pingHealthcheckStart(env);

    try {
      const [gasData, btcPrice, solPrice, ethPrice, goldPrice] = await Promise.all([
        fetchGasPrice(env),
        fetchBtcPrice(),
        fetchSolPrice(),
        fetchEthPrice(),
        fetchGoldPrice(),
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
          GOLD: goldPrice.price,
        },
      });

      const html = formatMessage(gasData, {
        btc: btcPrice.price,
        sol: solPrice.price,
        eth: ethPrice.price,
        gold: goldPrice.price,
      });

      await sendTelegramMessage(html, env);

      logger.info("worker_run_success", {
        messageLength: html.length,
      });

      await pingHealthcheckSuccess(
        env,
        `Gas: ${gasData.baseFee} Gwei | BTC: $${btcPrice.price} | ETH: $${ethPrice.price} | SOL: $${solPrice.price} | GOLD: $${goldPrice.price}`
      );
    } catch (error) {
      logger.error("worker_run_error", error);
      await pingHealthcheckFail(env, error);
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
