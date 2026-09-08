import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="legal-page">
      <header>
        <p className="eyebrow">K-VERSATION / Legal</p>
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated September 7, 2026</p>
      </header>
      <div className="legal-copy" data-reveal>
        <p>
          These terms govern access to K-VERSATION, including its films,
          editorial material, member features, and question submission tools.
          By using the service, you agree to these terms.
        </p>
        <h2>Publication content</h2>
        <p>
          K-VERSATION content is provided for cultural, educational, and
          informational purposes. It is not professional legal, medical,
          financial, or political advice. Unless otherwise stated, films,
          writing, design, and branding are owned by K-VERSATION or used with
          permission and may not be republished commercially without written
          consent.
        </p>
        <h2>Member accounts</h2>
        <p>
          You must provide accurate registration details, protect your
          credentials, and notify K-VERSATION of suspected unauthorized access.
          You are responsible for activity through your account. Accounts may
          be limited or removed for abuse, impersonation, spam, or repeated
          violation of these terms.
        </p>
        <h2>Community contributions</h2>
        <p>
          Comments, reactions, and questions must be lawful, relevant, and
          respectful. Do not submit harassment, threats, hate speech, private
          information, unlawful material, advertising spam, or content you do
          not have the right to share. You retain ownership of your
          contributions while granting K-VERSATION permission to store,
          display, moderate, and use them to operate and promote the service.
        </p>
        <h2>Moderation</h2>
        <p>
          K-VERSATION may hide or remove contributions, restrict activity, or
          suspend accounts to protect the publication and its community.
          Moderation decisions may be made without prior notice where immediate
          action is appropriate.
        </p>
        <h2>Availability and liability</h2>
        <p>
          The service may change, pause, or experience interruptions.
          K-VERSATION is provided “as is” to the extent permitted by law.
          K-VERSATION is not liable for indirect or consequential loss arising
          from use of the service.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:thekversation@gmail.com">thekversation@gmail.com</a>.
          These terms are a practical project draft and should be reviewed by
          qualified legal counsel before broad public launch.
        </p>
      </div>
    </article>
  );
}
