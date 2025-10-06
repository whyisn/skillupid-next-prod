import { NextResponse } from 'next/server';
import { verifyMidtransSignature } from '../../../../lib/payments';
import { supabaseAdmin } from '../../../../lib/supabase-server';

/**
 * Midtrans webhook handler (HTTP notification).
 * Ensure to configure the MIDTRANS notification URL to this endpoint.
 */
export async function POST(req){
  const body = await req.json();
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body || {};
  const ok = verifyMidtransSignature({ order_id, status_code, gross_amount, signature_key });
  if(!ok){
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Upsert payment & activate enrollment if paid
  const admin = supabaseAdmin();
  // You would parse order_id to map user/course from your checkout process
  // For demo, we only log payment
  await admin.from('payments').insert({
    user_id: null,
    course_id: null,
    amount: parseInt(gross_amount || '0', 10),
    status: transaction_status,
    external_ref: order_id
  });

  return NextResponse.json({ received: true });
}
