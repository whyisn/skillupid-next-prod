// lib/midtrans.js
import midtransClient from "midtrans-client";

export function getSnapClient() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return new midtransClient.Snap({
    isProduction,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });
}
