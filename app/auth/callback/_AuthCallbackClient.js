// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { supabaseBrowser } from "@/lib/supabase/client";

// export default function AuthCallbackClient() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const redirect = params.get("redirect") || "/dashboard";

//   useEffect(() => {
//     (async () => {
//       try {
//         const hash = window.location.hash?.startsWith("#") ? window.location.hash.slice(1) : "";
//         const h = new URLSearchParams(hash);
//         const access_token = h.get("access_token");
//         const refresh_token = h.get("refresh_token");
//         if (access_token && refresh_token) {
//           await supabaseBrowser.auth.setSession({ access_token, refresh_token });
//           router.replace(redirect);
//           return;
//         }
//         const code = new URLSearchParams(window.location.search).get("code");
//         if (code) {
//           await supabaseBrowser.auth.exchangeCodeForSession({ code });
//           router.replace(redirect);
//           return;
//         }
//       } catch {}
//       router.replace(redirect);
//     })();
//   }, [router, redirect]);

//   return <div className="p-10 text-center">Memproses login…</div>;
// }

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  useEffect(() => {
    (async () => {
      try {
        const hash = window.location.hash?.startsWith("#")
          ? window.location.hash.slice(1)
          : "";
        const h = new URLSearchParams(hash);

        const type =
          h.get("type") ||
          new URLSearchParams(window.location.search).get("type");

        // kalau dari email "lupa password" → kirim ke halaman ganti password
        const finalRedirect = type === "recovery"
          ? "/auth/change-password"
          : redirect;

        const access_token = h.get("access_token");
        const refresh_token = h.get("refresh_token");

        if (access_token && refresh_token) {
          await supabaseBrowser.auth.setSession({ access_token, refresh_token });
          router.replace(finalRedirect);
          return;
        }

        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          await supabaseBrowser.auth.exchangeCodeForSession({ code });
          router.replace(finalRedirect);
          return;
        }
      } catch {}

      router.replace(redirect);
    })();
  }, [router, redirect]);

  return <div className="p-10 text-center">Memproses login…</div>;
}
