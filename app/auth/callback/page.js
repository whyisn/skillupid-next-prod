// app/auth/callback/page.js
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  useEffect(() => {
    // (async () => {
    //   // Tukar "code" dari URL menjadi session + set cookie Supabase
    //   try {
    //     await supabaseBrowser.auth.exchangeCodeForSession();
    //   } catch (e) {
    //     // biarkan tetap redirect; session email/password biasanya sudah ada
    //   }
    //   router.replace(redirect);
    // })();
    (async () => {
      try {
        // 1) Jika provider mengembalikan token via hash: #access_token=...&refresh_token=...
        const hash = window.location.hash?.startsWith("#") ? window.location.hash.slice(1) : "";
        const h = new URLSearchParams(hash);
        const access_token = h.get("access_token");
        const refresh_token = h.get("refresh_token");
        if (access_token && refresh_token) {
          await supabaseBrowser.auth.setSession({ access_token, refresh_token });
          router.replace(redirect);
          return;
        }

        // 2) Jika pakai PKCE: ?code=...
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          // v2: boleh pass argumen ataupun auto-read dari URL; kita pakai eksplisit
          await supabaseBrowser.auth.exchangeCodeForSession({ code });
          router.replace(redirect);
          return;
        }
      } catch {
        // noop
      }
      // 3) Fallback: kalau tidak ada keduanya, tetap coba arahkan
      router.replace(redirect);
    })();
  }, [router, redirect]);

  return (
    <div className="p-10 text-center">
      Memproses login…
    </div>
  );
}
