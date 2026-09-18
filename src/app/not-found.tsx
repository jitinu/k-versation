import Link from "next/link";
export default function NotFound() {
  return (
    <div
      data-theme="ivory"
      className="page flex min-h-[80dvh] flex-col items-center justify-center text-center"
    >
      <p className="display-clamp">404</p>
      <p className="eyebrow mt-10">Page not found</p>
      <Link className="btn btn-primary mt-8" href="/">
        Return home <span className="arrow">↗</span>
      </Link>
    </div>
  );
}
