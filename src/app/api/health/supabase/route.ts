import { NextResponse } from "next/server";
import { clientEnv, hasSupabasePublicConfig } from "@/config/env";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabasePublicConfig()) {
    return NextResponse.json({
      ok: false,
      status: "not_configured",
      message: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    });
  }

  const baseUrl = clientEnv.supabaseUrl.replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/rest/v1/`, {
      cache: "no-store",
      headers: {
        apikey: clientEnv.supabaseAnonKey,
        Authorization: `Bearer ${clientEnv.supabaseAnonKey}`
      }
    });

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      message: response.ok ? "Supabase REST endpoint reachable." : "Supabase returned a non-OK status."
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
  }
}
