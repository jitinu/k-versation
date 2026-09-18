import Link from "next/link";
export function FooterStrip() {
  return (
    <footer className="bg-[#080807] text-[#e8e8e3]">
      <div className="page section-gap">
        <p className="display-clamp overflow-hidden">
          <span className="inline-block">K-VERSATION</span>
        </p>
        <div className="mt-20 grid gap-10 text-sm md:grid-cols-[1fr_2fr_1fr] md:items-end">
          <p>© K-versation. All rights reserved.</p>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
            {[
              ["/conversations", "Conversations"],
              ["/monologues", "Monologues"],
              ["/about", "About"],
              ["/questions", "Questions"],
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="link-draw w-max">
                {label}
              </Link>
            ))}
          </nav>
          <Link href="mailto:thekversation@gmail.com" className="link-draw md:justify-self-end">
            Connect — thekversation@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
