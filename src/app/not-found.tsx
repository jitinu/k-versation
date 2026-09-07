import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-code">404</div>
      <BrandMark />
      <h1>This part of the conversation has moved.</h1>
      <p>
        The page may be unpublished, renamed, or waiting to be made. Return to
        the latest stories.
      </p>
      <Link className="button" href="/">Return home</Link>
    </div>
  );
}
