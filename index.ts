import { config } from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { facilitator } from "@payai/facilitator";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactSvmScheme } from "@x402/svm/exact/server";

config();

const app = new Hono();

const svmAddress = process.env.SVM_ADDRESS;
const network = process.env.X402_NETWORK ?? "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
const price = process.env.PRICE ?? "$0.001";

if (!svmAddress) {
  throw new Error(
    "Missing SVM_ADDRESS. Add your Solana wallet address in Railway Variables."
  );
}

const facilitatorClient = new HTTPFacilitatorClient(facilitator);

const resourceServer = new x402ResourceServer(facilitatorClient).register(
  network,
  new ExactSvmScheme()
);

app.get("/", (c) => {
  return c.json({
    ok: true,
    name: "x402 Solana Merchant",
    message: "Server is running.",
    paidEndpoint: "/paid",
    network,
    price
  });
});

app.use(
  paymentMiddleware(
    {
      "GET /paid": {
        accepts: [
          {
            scheme: "exact",
            price,
            network,
            payTo: svmAddress
          }
        ],
        description: "Paid agent API via x402 on Solana",
        mimeType: "application/json"
      }
    },
    resourceServer
  )
);

app.get("/paid", (c) => {
  return c.json({
    ok: true,
    paid: true,
    message: "Payment confirmed. Your paid x402 endpoint is working.",
    result: {
      service: "example-paid-agent-service",
      timestamp: new Date().toISOString()
    }
  });
});

const port = Number(process.env.PORT ?? 4021);

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0"
});

console.log(`x402 Solana merchant running on port ${port}`);
