# ETH Gas Tracker Bot

Cloudflare Worker that tracks Ethereum gas prices and ETH price, posting updates to Telegram every minute.

## Features

- Fetches ETH gas price from Ethereum RPC
- Fetches ETH/USDT price from Binance API
- Posts HTML formatted message to Telegram channel
- Runs on a scheduled cron (every 1 minute)

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

### 3. Get your credentials

- **ETHEREUM_RPC_URL**: Use Infura, Alchemy, or any mainnet RPC endpoint
- **TELEGRAM_BOT_TOKEN**: Get from [@BotFather](https://t.me/BotFather)
- **TELEGRAM_CHAT_ID**: Your channel username (e.g., `@your_channel`) or chat ID

## Development

```bash
# Create .dev.vars with your credentials first
bunx wrangler dev
```

## Deployment

```bash
bunx wrangler deploy
```

## Sample Output

```
⛽ ETH Gas Tracker

💰 ETH Price: $3,456.78

⏱️ Gas Prices (Gwei):
  🐢 Slow:   25.00
  🐇 Standard: 31.00
  🚀 Fast:   37.00

⏰ Updated: 2024-01-15T12:00:00.000Z
```
