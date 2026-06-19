# x402 Solana Railway Merchant

Minimal x402 paid API endpoint for receiving Solana USDC payments via a Railway-deployed Hono server.

## Endpoints

- `GET /` — health check / server info
- `GET /paid` — x402-protected paid endpoint

## Railway Variables

For Solana Devnet testing:

```env
SVM_ADDRESS=YOUR_SOLANA_WALLET_ADDRESS
X402_NETWORK=solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1
PRICE=$0.001
```

For Solana Mainnet USDC:

```env
SVM_ADDRESS=YOUR_SOLANA_WALLET_ADDRESS
X402_NETWORK=solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp
PRICE=$0.01
```

Optional production PayAI variables:

```env
PAYAI_API_KEY_ID=your-key-id
PAYAI_API_KEY_SECRET=your-key-secret
```

## Deploy on Railway

1. Create a new Railway project.
2. Choose **Deploy from GitHub repo**.
3. Select this repository.
4. Add the variables above.
5. Deploy.
6. Go to **Settings → Networking → Generate Domain**.
7. Open your generated domain.

Example:

```txt
https://your-app.up.railway.app/
https://your-app.up.railway.app/paid
```

`/paid` should return an HTTP 402 response until a valid x402 payment is provided.

## Buyer/agent instruction

Give this to an x402-capable agent:

```txt
Use this x402 paid endpoint:
GET https://your-app.up.railway.app/paid

Payment: x402 exact
Network: Solana mainnet
CAIP-2: solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp
Asset: USDC Solana
Price: $0.01 per request
```

## Security

Only use your public Solana wallet address for `SVM_ADDRESS`.
Never put your seed phrase or private key in GitHub, Railway, or environment variables.
