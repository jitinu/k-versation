import Link from "next/link";
export function FooterStrip() {
  return (
    <footer className="border-line md:bg-canvas mt-auto border-t p-4 text-xs md:fixed md:bottom-0 md:left-0 md:z-30 md:flex md:w-full md:justify-between md:gap-4 md:p-3">
      <span>K-VERSATION</span>
      <span>© K-versation. All rights reserved.</span>
      <Link href="mailto:thekversation@gmail.com" className="link-draw">
        Connect — thekversation@gmail.com
      </Link>
    </footer>
  );
}
