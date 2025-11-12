// app/auth/sign-in/_SignInClient.js
"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function SignInClient() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  // Pastikan redirectTo absolute URL:
  const siteUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (typeof window !== "undefined") return window.location.origin;
    return ""; // SSR fallback (tidak dipakai Auth karena komponen client)
  }, []);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data?.session?.user) router.replace(redirect);
    });
    const { data: { subscription } } =
      supabaseBrowser.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          router.replace(redirect);
        }
      });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [router, redirect]);

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-4">Masuk ke SkillUpID</h1>
      <Auth
        supabaseClient={supabaseBrowser}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
        redirectTo={`${siteUrl}/auth/callback?redirect=${encodeURIComponent(redirect)}`}
        magicLink
      />
    </div>
  );
}
