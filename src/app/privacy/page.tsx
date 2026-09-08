import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 7, 2026">
      <p>
        This policy explains how K-VERSATION collects, uses, and protects
        information when you browse the publication, join as a member, watch
        films, react, comment, or submit a question.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you create an account, we collect your name, email address,
        username, selected country, and optional phone number. Authentication
        credentials are processed by our authentication provider; K-VERSATION
        does not store readable passwords. Questions include the name, email,
        category, and message you submit. Comments and reactions are stored
        with your member account.
      </p>
      <p>
        We record limited first-party usage data such as public page
        impressions, video starts, meaningful views, completion milestones,
        coarse country totals, browser user agent, and privacy-preserving
        request identifiers. We do not publish precise member locations,
        email addresses, or phone numbers.
      </p>
      <h2>How information is used</h2>
      <p>
        Information is used to operate accounts, provide community features,
        answer questions, moderate misuse, understand publication reach,
        improve films and pages, and maintain security. Country information is
        shown only in aggregate.
      </p>
      <h2>Service providers</h2>
      <p>
        K-VERSATION uses Supabase for authentication and data storage, Mux for
        video delivery and playback, Resend for transactional email, and the
        selected hosting provider to serve the website. These providers process
        data under their own terms and privacy commitments.
      </p>
      <h2>Retention and control</h2>
      <p>
        Data is retained only as long as needed for the purposes described
        above, legal obligations, or platform security. Members can update or
        delete their account from account settings. A deleted account’s public
        contributions may be removed or anonymized where retention is
        necessary for conversation integrity.
      </p>
      <h2>Cookies</h2>
      <p>
        Essential cookies maintain member and host sessions. Session storage
        remembers whether the optional opening experience has been seen during
        the current browsing session. K-VERSATION does not currently use
        advertising cookies.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy requests can be sent to{" "}
        <a href="mailto:thekversation@gmail.com">thekversation@gmail.com</a>.
        This policy should be reviewed by qualified legal counsel before a
        material change in data practices or broad public launch.
      </p>
    </LegalPage>
  );
}

function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="legal-page">
      <header>
        <p className="eyebrow">K-VERSATION / Legal</p>
        <h1>{title}</h1>
        <p>Last updated {updated}</p>
      </header>
      <div className="legal-copy" data-reveal>{children}</div>
    </article>
  );
}
