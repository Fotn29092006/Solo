import { NextResponse } from "next/server";
import { clientEnv, hasSupabasePublicConfig } from "@/config/env";

export const dynamic = "force-dynamic";

const SUPABASE_HEALTH_TIMEOUT_MS = 8000;

export async function GET() {
  if (!hasSupabasePublicConfig()) {
    return NextResponse.json({
      ok: false,
      status: "not_configured",
      message: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    });
  }

  const baseUrl = clientEnv.supabaseUrl.replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/auth/v1/settings`, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: clientEnv.supabaseAnonKey
      }
    });

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      message: response.ok ? "Supabase project reachable." : "Supabase returned a non-OK status."
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        message: error instanceof Error ? error.message : "Supabase connection test failed."
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
