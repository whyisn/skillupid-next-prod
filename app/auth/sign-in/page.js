// app/auth/sign-in/page.js
// "use client";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import SignInClient from './_SignInClient';

import { supabaseBrowser } from "@/lib/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/dashboard";

  useEffect(() => {
    // const { data: { subscription } } =
    //   supabaseBrowser.auth.onAuthStateChange((event) => {
    //     if (event === "SIGNED_IN") router.replace(redirect);
    //   });
    // return () => subscription.unsubscribe();
    let mounted = true;

    // 1) Redirect segera jika sesi sudah ada (mis. kembali dari OAuth)
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data?.session?.user) router.replace(redirect);
    });

    // 2) Dengarkan event SIGNED_IN / TOKEN_REFRESHED
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((event) => {
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
        // redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(redirect)}`}
        magicLink
      />
    </div>
  );
}
