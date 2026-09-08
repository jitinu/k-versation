import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page flex min-h-[80dvh] flex-col items-center justify-center text-center">
      <p className="display-clamp">404</p>
      <p className="mt-10 text-xl">Page not found</p>
      <Link className="link-draw mt-8" href="/">
        Return home
      </Link>
    </div>
  );
}
