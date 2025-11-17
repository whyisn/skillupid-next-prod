// // import { NextResponse } from 'next/server';
// // import { verifyMidtransSignature } from '../../../../lib/payments';
// // import { supabaseAdmin } from '../../../../lib/supabase-server';

// // /**
// //  * Midtrans webhook handler (HTTP notification).
// //  * Ensure to configure the MIDTRANS notification URL to this endpoint.
// //  */
// // export async function POST(req){
// //   const body = await req.json();
// //   const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body || {};
// //   const ok = verifyMidtransSignature({ order_id, status_code, gross_amount, signature_key });
// //   if(!ok){
// //     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
// //   }

// //   // Upsert payment & activate enrollment if paid
// //   const admin = supabaseAdmin();
// //   // You would parse order_id to map user/course from your checkout process
// //   // For demo, we only log payment
// //   await admin.from('payments').insert({
// //     user_id: null,
// //     course_id: null,
// //     amount: parseInt(gross_amount || '0', 10),
// //     status: transaction_status,
// //     external_ref: order_id
// //   });

// //   return NextResponse.json({ received: true });
// // }

// // app/api/webhooks/midtrans/route.js
// import { NextResponse } from "next/server";
// import { verifyMidtransSignature } from "../../../../lib/payments";
// import { supabaseAdmin } from "../../../../lib/supabase-server";

// export async function POST(req) {
//   const body = await req.json();

//   const {
//     order_id,
//     status_code,
//     gross_amount,
//     signature_key,
//     transaction_status,
//     fraud_status,
//   } = body || {};

//   const ok = verifyMidtransSignature({
//     order_id,
//     status_code,
//     gross_amount,
//     signature_key,
//   });

//   if (!ok) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   const admin = supabaseAdmin();

//   // Update payment berdasarkan order_id
//   const { data: payment } = await admin
//     .from("payments")
//     .update({ status: transaction_status })
//     .eq("external_ref", order_id)
//     .select("id,user_id,course_id")
//     .maybeSingle();

//   // Kalau pembayaran sukses → buat enrollment
//   const successStatuses = ["capture", "settlement"];
//   if (payment && successStatuses.includes(transaction_status) && fraud_status !== "deny") {
//     // cek sudah pernah enroll atau belum (optional)
//     await admin
//       .from("enrollments")
//       .insert({ user_id: payment.user_id, course_id: payment.course_id })
//       .onConflict("user_id,course_id")
//       .ignore();
//   }

//   return NextResponse.json({ received: true });
// }

// app/api/webhooks/midtrans/route.js
import { NextResponse } from "next/server";
import { verifyMidtransSignature } from "@/lib/payments";
import { supabaseAdmin } from "@/lib/supabase-server";

/**
 * Midtrans webhook handler (HTTP notification).
 * Set di dashboard Midtrans:
 * https://your-domain.com/api/webhooks/midtrans
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body || {};

    // --- 1. Validasi signature dari Midtrans ---
    const ok = verifyMidtransSignature({
      order_id,
      status_code,
      gross_amount,
      signature_key,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    // --- 2. Update tabel payments berdasarkan order_id ---
    const { data: payment, error: payErr } = await admin
      .from("payments")
      .update({
        status: transaction_status,
        fraud_status,
        status_code,
        raw_notification: body, // kolom JSONB opsional, kalau ada
      })
      .eq("order_id", order_id)
      .select("*")
      .single();

    if (payErr) {
      console.error("Update payment error:", payErr);
      // Tetap balas 200 supaya Midtrans tidak spam retry
      return NextResponse.json({ received: true });
    }

    // --- 3. Kalau pembayaran sukses → buat enrollment ---
    const successStatuses = ["capture", "settlement"];

    if (
      payment &&
      successStatuses.includes(transaction_status) &&
      fraud_status !== "deny"
    ) {
      const { error: enrollErr } = await admin
        .from("enrollments")
        .upsert(
          {
            user_id: payment.user_id,
            course_id: payment.course_id,
            status: "active",
          },
          { onConflict: "user_id,course_id" }
        );

      if (enrollErr) {
        console.error("Enroll error:", enrollErr);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.error("Midtrans webhook error:", e);
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
