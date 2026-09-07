"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/host")) return null;
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <BrandMark />
        <p className="footer-statement">
          Korea, in conversation with the world.
        </p>
      </div>
      <div className="footer-columns">
        <div>
          <p className="eyebrow">Explore</p>
          <Link href="/conversations">Conversations</Link>
          <Link href="/dispatches">Dispatches</Link>
          <Link href="/about">About Daniel</Link>
        </div>
        <div>
          <p className="eyebrow">Connect</p>
          <a href="mailto:thekversation@gmail.com">
            thekversation@gmail.com
          </a>
          <Link href="/questions">Ask a question</Link>
          <Link href="/join">Join K-VERSATION</Link>
        </div>
        <div>
          <p className="eyebrow">Information</p>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} K-VERSATION.</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}
