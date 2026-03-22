import type { TelegramMessage, Env } from "../types";
import { logger } from "../utils/logger";

export async function sendTelegramMessage(html: string, env: Env): Promise<void> {
  const message: TelegramMessage = {
    chat_id: env.TELEGRAM_CHAT_ID,
    text: html,
    parse_mode: "HTML",
  };

  logger.info("telegram_send_start", {
    chatId: env.TELEGRAM_CHAT_ID,
    messageLength: html.length,
  });

  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error: ${response.status} - ${error}`);
    }

    logger.info("telegram_send_success", {
      chatId: env.TELEGRAM_CHAT_ID,
      messageLength: html.length,
    });
  } catch (error) {
    logger.error("telegram_send_error", error, {
      chatId: env.TELEGRAM_CHAT_ID,
      messageLength: html.length,
    });
    throw error;
  }
}
