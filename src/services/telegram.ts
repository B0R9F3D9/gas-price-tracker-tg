import type { TelegramMessage, Env } from "../types";

export async function sendTelegramMessage(html: string, env: Env): Promise<void> {
  const message: TelegramMessage = {
    chat_id: env.TELEGRAM_CHAT_ID,
    text: html,
    parse_mode: "HTML",
  };

  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
}
