export const metadata = { title: "Privacy", description: "K-VERSATION privacy policy." };
export default function Privacy() {
  return (
    <div className="page section-gap max-w-3xl pt-40 normal-case">
      <h1 className="mb-12 text-6xl">Privacy</h1>
      <div className="text-ink-2 space-y-8">
        <section>
          <h2 className="text-ink text-2xl">Information we collect</h2>
          <p className="mt-3">
            When you create an account, we collect your email, display name, username, country, and
            any optional phone number you provide. We also receive comments, reactions, and
            subscription choices you make on the site.
          </p>
        </section>
        <section>
          <h2 className="text-ink text-2xl">How we use information</h2>
          <p className="mt-3">
            We use this information to provide accounts, publish community activity, keep the
            service secure, and understand aggregate interest in our videos. We do not sell personal
            information.
          </p>
        </section>
        <section>
          <h2 className="text-ink text-2xl">Cookies and analytics</h2>
          <p className="mt-3">
            We use essential session cookies and a consent preference. If configured, Plausible
            Analytics provides privacy-friendly, aggregate site statistics without advertising
            profiles.
          </p>
        </section>
        <section>
          <h2 className="text-ink text-2xl">Your choices</h2>
          <p className="mt-3">
            You may request access to or deletion of your account by emailing
            thekversation@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
