// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";

// export function createClient() {
//   const cookieStore = cookies(); // cookie pada request/response saat ini
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         get(name) {
//           return cookieStore.get(name)?.value;
//         },
//         set(name, value, options) {
//           // penting: App Router mengizinkan set/update cookie di server components & route handlers
//           cookieStore.set({ name, value, ...options });
//         },
//         remove(name, options) {
//           cookieStore.set({ name, value: "", ...options, maxAge: 0 });
//         },
//       },
//     }
//   );
// }

// lib/supabase/server.js
import { cookies } from "next/headers";
import { createServerClient as _createServerClient } from "@supabase/ssr";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** READ-ONLY — aman untuk Server Components (page/layout) */
function createServerClientReadOnly() {
  const cookieStore = cookies();
  return _createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},   // no-op di RSC
      set:    () => {},   // no-op
      remove: () => {},   // no-op
    },
  });
}

/** READ-WRITE — pakai HANYA di Route Handler / Server Action */
export function createServerClientWritable() {
  const cookieStore = cookies();
  return _createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      set:    (name, value, options) => cookieStore.set(name, value, options),
      remove: (name, options)       => cookieStore.set(name, "", { ...options, maxAge: 0 }),
    },
  });
}

// Ekspor kompatibel dengan kode lama-mu:
export function createClient()       { return createServerClientReadOnly(); }
export function createServerClient() { return createServerClientReadOnly(); }
export default createServerClientReadOnly;
