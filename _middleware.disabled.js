// middleware.js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = [/^\/dashboard/, /^\/learn/];

export async function middleware(req) {
  const url = req.nextUrl.clone();
  // const shouldProtect = PROTECTED.some((r) => r.test(url.pathname));
  // if (!shouldProtect) return NextResponse.next();
  const isProtected = PROTECTED.some((r) => r.test(url.pathname));

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (k) => req.cookies.get(k)?.value,
        set: (k, v, o) => res.cookies.set(k, v, o),
        remove: (k, o) => res.cookies.set(k, "", { ...o, maxAge: 0 }),
      },
    }
  );

  // const { data } = await supabase.auth.getUser();
  // if (!data.user) {
  //   url.pathname = "/auth/sign-in";
  //   url.searchParams.set("redirect", req.nextUrl.pathname);
  //   return NextResponse.redirect(url);
  // }
  // return res;
  const { data } = await supabase.auth.getUser();

  // 1) Jika user sudah login dan membuka /auth/sign-in → kirim ke dashboard (atau redirect param)
  if (url.pathname.startsWith("/auth/sign-in") && data?.user) {
    const redirect = req.nextUrl.searchParams.get("redirect") || "/dashboard";
    url.pathname = redirect;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // 2) Proteksi halaman private
  if (isProtected && !data?.user) {
    url.pathname = "/auth/sign-in";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return res;
}
