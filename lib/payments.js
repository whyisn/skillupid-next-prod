import crypto from 'crypto';

/**
 * Verify Midtrans signature (example for HTTP notification with signature_key in body).
 * Actual verification may vary based on payment type.
 */
export function verifyMidtransSignature({ order_id, status_code, gross_amount, signature_key }){
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const raw = order_id + status_code + gross_amount + serverKey;
  const calc = crypto.createHash('sha512').update(raw).digest('hex');
  return calc === signature_key;
}
