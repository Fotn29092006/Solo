"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";

interface SupabaseHealth {
  ok: boolean;
  status: number | string;
  message: string;
}

export function SupabaseConnectionTest() {
  const [health, setHealth] = useState<SupabaseHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/health/supabase", { cache: "no-store" })
      .then((response) => response.json() as Promise<SupabaseHealth>)
      .then((data) => {
        if (mounted) {
          setHealth(data);
        }
      })
      .catch((error: unknown) => {
        if (mounted) {
          setHealth({
            ok: false,
            status: "error",
            message: error instanceof Error ? error.message : "Connection test failed."
          });
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const label = isLoading ? "Checking" : health?.ok ? "Ready" : "Needs env";
  const tone = isLoading ? "cyan" : health?.ok ? "green" : "amber";

  return (
    <section className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Supabase connection</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {isLoading ? "Checking runtime configuration." : health?.message}
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>
    </section>
  );
}
