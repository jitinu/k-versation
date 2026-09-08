export const metadata = { title: "Terms", description: "K-VERSATION terms of use." };
export default function Terms() {
  return (
    <div className="page section-gap max-w-3xl pt-40 normal-case">
      <h1 className="mb-12 text-6xl">Terms</h1>
      <div className="text-ink-2 space-y-8">
        <section>
          <h2 className="text-ink text-2xl">Using K-VERSATION</h2>
          <p className="mt-3">
            K-VERSATION is a video and community publication. You may watch and share content for
            personal, lawful purposes. Keep account details secure and do not impersonate another
            person.
          </p>
        </section>
        <section>
          <h2 className="text-ink text-2xl">Community contributions</h2>
          <p className="mt-3">
            Comments must be relevant, respectful, and your own. We may remove content or suspend
            accounts that abuse the service, violate rights, or create risk for other people.
          </p>
        </section>
        <section>
          <h2 className="text-ink text-2xl">Content and availability</h2>
          <p className="mt-3">
            K-VERSATION retains rights in its original videos and design. We work to keep the site
            available and accurate, but services may change or be interrupted.
          </p>
        </section>
        <section>
          <h2 className="text-ink text-2xl">Contact</h2>
          <p className="mt-3">
            Questions about these terms can be sent to thekversation@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
}
