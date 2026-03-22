# ETH Gas Tracker Bot

Cloudflare Worker that tracks Ethereum gas prices and crypto prices (BTC, SOL, ETH), posting updates to Telegram every minute.

## Features

- Fetches ETH gas price from Ethereum RPC
- Fetches BTC, SOL, ETH prices from Binance API
- Color-coded gas indicator (green/yellow/red based on thresholds)
- Posts HTML formatted message to Telegram channel
- Runs on a scheduled cron (every 1 minute)

## Project Structure

```
src/
├── core/
│   └── index.ts          # Main worker entry point
├── services/
│   ├── gas.ts            # Gas price fetching from RPC
│   ├── prices.ts         # Crypto prices from Binance
│   └── telegram.ts       # Telegram messaging
├── utils/
│   ├── constants.ts      # API URLs, gas thresholds
│   └── formatters.ts     # Message formatting, color logic
└── types/
    └── index.ts          # TypeScript type definitions
```

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
🟩 0.07 - ETH Gwei⛽️

$BTC: 67,543.21
$SOL: 142.85
$ETH: 3,456.78
```

## Gas Color Thresholds

| Range (Gwei) | Color | Emoji |
|-------------|-------|-------|
| 0-10 | Green | 🟩 |
| 10-25 | Yellow | 🟨 |
| 25+ | Red | 🟥 |
