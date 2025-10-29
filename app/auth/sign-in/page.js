// app/auth/sign-in/page.js
"use client";

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
    const { data: { subscription } } =
      supabaseBrowser.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") router.replace(redirect);
      });
    return () => subscription.unsubscribe();
  }, [router, redirect]);

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-4">Masuk ke SkillUpID</h1>
      <Auth
        supabaseClient={supabaseBrowser}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        magicLink
      />
    </div>
  );
}
