// "use client";
// // lib/supabase/client.js
// // Use the SSR helpers' browser client so auth state plays nicely with Next App Router.
// import { createBrowserClient } from "@supabase/ssr";

// export const supabaseBrowser = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// lib/supabase/client.js
"use client";

import { createBrowserClient } from "@supabase/ssr";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Instance untuk browser
export const supabase = createBrowserClient(url, anon);

// Alias agar kompatibel dengan import-mu sekarang:
export const supabaseBrowser = supabase;

// (opsional) default getter
export default function getSupabaseBrowser() {
  return supabase;
}
