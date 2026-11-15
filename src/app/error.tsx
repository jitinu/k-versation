"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section data-theme="ivory" className="page flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="eyebrow">K-VERSATION</p>
      <h1 className="mt-6 max-w-[18ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-[-0.03em]">
        Something didn&apos;t load.
      </h1>
      <p className="text-ink-2 mt-6 max-w-md">
        Please try again. It usually works on the second try.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          Try again
        </button>
        <Link href="/" className="btn">
          Go to the homepage
        </Link>
      </div>
    </section>
  );
}
