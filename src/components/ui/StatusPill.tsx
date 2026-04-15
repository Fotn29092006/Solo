interface StatusPillProps {
  label: string;
  tone?: "cyan" | "green" | "amber" | "rose";
}

const toneClassName = {
  cyan: "border-[var(--cyan)] text-[var(--cyan)]",
  green: "border-[var(--green)] text-[var(--green)]",
  amber: "border-[var(--amber)] text-[var(--amber)]",
  rose: "border-[var(--rose)] text-[var(--rose)]"
};

export function StatusPill({ label, tone = "cyan" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-[8px] border px-2.5 text-xs font-semibold ${toneClassName[tone]}`}
    >
      {label}
    </span>
  );
}
