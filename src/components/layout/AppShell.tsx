import Link from "next/link";
import { APP_CONFIG } from "@/config/app";
import { APP_NAVIGATION } from "@/config/navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="telegram-safe-area mx-auto flex w-full max-w-[520px] flex-col gap-5">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="min-w-0">
          <p className="text-xs uppercase text-[var(--muted)]">Telegram Mini App</p>
          <h1 className="truncate text-xl font-semibold text-[var(--foreground)]">
            {APP_CONFIG.publicBrand}
          </h1>
        </div>
        <div className="rounded-[8px] border border-[var(--line)] px-3 py-2 text-right">
          <p className="text-xs text-[var(--muted)]">Build</p>
          <p className="text-sm font-semibold text-[var(--cyan)]">MVP</p>
        </div>
      </header>

      {children}

      <nav className="grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-4">
        {APP_NAVIGATION.map((item) => (
          <Link
            className="focus-ring rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 py-3 text-center text-sm font-semibold text-[var(--foreground)]"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
