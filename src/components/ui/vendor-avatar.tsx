import { cn, initials } from "@/lib/utils";

export function VendorAvatar({
  name,
  color,
  size = 28,
  className,
}: {
  name: string;
  color?: string | null;
  size?: number;
  className?: string;
}) {
  const fallback = color ?? "#7c5cff";
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-lg text-[10px] font-semibold uppercase tracking-wide text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(140deg, ${fallback}, ${shade(fallback, -25)})`,
        boxShadow: `0 6px 14px -6px ${fallback}55`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

function shade(hex: string, percent: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  let r = (n >> 16) + percent;
  let g = ((n >> 8) & 0x00ff) + percent;
  let b = (n & 0x0000ff) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
