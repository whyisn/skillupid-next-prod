// // app/api/checkout/route.js
// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { supabaseAdmin } from "@/lib/supabase-server";
// import { getSnapClient } from "@/lib/midtrans";

// export async function POST(req) {
//   try {
//     const { course_id } = await req.json();
//     if (!course_id) {
//       return NextResponse.json({ error: "course_id wajib ada" }, { status: 400 });
//     }

//     const supabase = createClient();

//     // Ambil user dari cookie Supabase
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
//     }

//     // Ambil data course
//     const { data: course, error: courseError } = await supabase
//       .from("courses")
//       .select("id,title,price,premium")
//       .eq("id", course_id)
//       .single();

//     if (courseError || !course) {
//       return NextResponse.json({ error: "Kursus tidak ditemukan" }, { status: 404 });
//     }

//     if (!course.premium) {
//       return NextResponse.json({ error: "Kursus ini gratis, tidak perlu pembayaran" }, { status: 400 });
//     }

//     const amount = course.price || 0;
//     if (amount <= 0) {
//       return NextResponse.json({ error: "Harga kursus belum diset" }, { status: 400 });
//     }

//     // Buat order_id unik
//     // const orderId = `COURSE-${course.id}-${user.id}-${Date.now()}`;
//     const shortRandom = Math.random().toString(36).substring(2, 8); // 6 char acak
//     const orderId = `COURSE-${Date.now()}-${shortRandom}`; // total < 50 char

//     const snap = getSnapClient();

//     // Create transaction ke Midtrans
//     const transaction = await snap.createTransaction({
//       transaction_details: {
//         order_id: orderId,
//         gross_amount: amount,
//       },
//       item_details: [
//         {
//           id: course.id,
//           price: amount,
//           quantity: 1,
//           name: course.title?.slice(0, 50) || "Premium Course",
//         },
//       ],
//       customer_details: {
//         email: user.email,
//       },
//     });

//     // Simpan payment pending di Supabase
//     const admin = supabaseAdmin();
//     await admin.from("payments").insert({
//       user_id: user.id,
//       course_id: course.id,
//       amount: amount,
//       status: "pending",
//       external_ref: orderId,
//     });

//     return NextResponse.json(
//       {
//         token: transaction.token,
//         redirect_url: transaction.redirect_url,
//       },
//       { status: 200 }
//     );
//   } catch (e) {
//     console.error("Checkout error:", e);
//     return NextResponse.json({ error: e.message || "Checkout gagal" }, { status: 500 });
//   }
// }

// app/api/checkout/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getSnapClient } from "@/lib/midtrans";

export async function POST(req) {
  try {
    const { course_id } = await req.json();
    if (!course_id) {
      return NextResponse.json(
        { error: "course_id wajib ada" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // --- 1. Ambil user dari cookie Supabase ---
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json(
        { error: "Harus login dulu" },
        { status: 401 }
      );
    }

    // --- 2. Ambil data course ---
    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .select("id,title,price,premium")
      .eq("id", course_id)
      .single();

    if (courseErr || !course) {
      return NextResponse.json(
        { error: "Course tidak ditemukan" },
        { status: 404 }
      );
    }

    if (!course.premium) {
      return NextResponse.json(
        { error: "Course ini gratis, gunakan /api/enroll" },
        { status: 400 }
      );
    }

    const amount = course.price || 0;
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Harga course tidak valid" },
        { status: 400 }
      );
    }

    // --- 3. Buat record payment di Supabase ---
    const admin = supabaseAdmin();

    // order_id harus unik
    const orderId = `COURSE-${course.id}-${user.id}-${Date.now()}`;

    const { data: payment, error: payErr } = await admin
      .from("payments")
      .insert({
        user_id: user.id,
        course_id: course.id,
        amount,
        status: "pending",
        order_id: orderId,
      })
      .select("*")
      .single();

    if (payErr) {
      console.error("Insert payment error:", payErr);
      return NextResponse.json(
        { error: "Gagal membuat payment" },
        { status: 500 }
      );
    }

    // --- 4. Buat transaksi Midtrans Snap ---
    const snap = getSnapClient();

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: payment.order_id,
        gross_amount: amount,
      },
      customer_details: {
        email: user.email,
      },
      item_details: [
        {
          id: course.id,
          price: amount,
          quantity: 1,
          name: course.title,
        },
      ],
    });

    return NextResponse.json(
      {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: e.message || "Checkout gagal" },
      { status: 500 }
    );
  }
}
