"use client";
// lib/supabase/client.js
// Use the SSR helpers' browser client so auth state plays nicely with Next App Router.
import { createBrowserClient } from "@supabase/ssr";

export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);