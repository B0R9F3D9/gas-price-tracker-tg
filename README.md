# ETH Gas Tracker Bot

Cloudflare Worker that tracks Ethereum gas prices and crypto prices (BTC, ETH, SOL), posting updates to Telegram every minute.

## Features

- Fetches ETH gas price from Ethereum RPC
- Fetches BTC, ETH, SOL from major exchanges (OKX, Binance, KuCoin, Gate.io, Coinbase, Bitget, Kraken)
- Resilient rate-limiting handling and safe response parsing
- Color-coded gas indicator (green/yellow/red based on thresholds)
- Posts HTML formatted message to Telegram channel
- Healthchecks.io monitoring (/start, /fail, success pings with diagnostic logs)
- Runs on a scheduled cron (every 1 minute)

## Project Structure

```
src/
├── core/
│   └── index.ts          # Main worker entry point
├── services/
│   ├── gas.ts            # Gas price fetching from RPC
│   ├── prices.ts         # Crypto prices with multi-exchange fallback
│   ├── healthcheck.ts    # Healthchecks.io pinging
│   └── telegram.ts       # Telegram messaging
├── utils/
│   ├── constants.ts      # API URLs, gas thresholds
│   ├── formatters.ts     # Message formatting, color logic
│   └── logger.ts         # Structured JSON logging
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

Edit `.env` (or set via `bunx wrangler secret put HEALTHCHECK_URL`):

```env
ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=@your_channel
HEALTHCHECK_URL=https://hc-ping.com/your-uuid-here
```

### 3. Get your credentials

- **ETHEREUM_RPC_URL**: Use Infura, Alchemy, or public RPC endpoint
- **TELEGRAM_BOT_TOKEN**: Get from [@BotFather](https://t.me/BotFather)
- **TELEGRAM_CHAT_ID**: Your channel username (e.g., `@your_channel`) or chat ID
- **HEALTHCHECK_URL** (optional): Check ping URL from [healthchecks.io](https://healthchecks.io/)

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

| Range (Gwei) | Color  | Emoji |
| ------------ | ------ | ----- |
| 0-10         | Green  | 🟩    |
| 10-25        | Yellow | 🟨    |
| 25+          | Red    | 🟥    |
