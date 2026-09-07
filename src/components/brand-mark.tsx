import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand-mark${compact ? " brand-mark--compact" : ""}`}
      aria-label="K-VERSATION home"
    >
      <span>K</span>
      <span className="brand-bridge" aria-hidden="true" />
      <span>VERSATION</span>
    </Link>
  );
}
