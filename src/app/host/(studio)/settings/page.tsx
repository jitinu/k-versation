import { HostPasswordForm } from "@/components/host-actions";

export default function HostSettingsPage() {
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Studio security</p><h2>Settings</h2></div>
        <p>Rotate the host credential without exposing it to browser storage or source control.</p>
      </div>
      <section className="host-card settings-card">
        <div>
          <p className="eyebrow">Host credential</p>
          <h3>Change password</h3>
          <p>The replacement is hashed before storage. Existing host sessions expire independently after eight hours.</p>
        </div>
        <HostPasswordForm />
      </section>
    </div>
  );
}
