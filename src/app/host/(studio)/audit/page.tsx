import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export default async function AuditPage() {
  const admin = createAdminSupabaseClient();
  const { data } = admin
    ? await admin.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500)
    : { data: [] };
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Governance</p><h2>Audit log</h2></div>
        <p>An append-only history of content, moderation, and metric changes.</p>
      </div>
      <div className="host-table-wrap">
        <table className="host-table">
          <thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Change</th><th>Note</th></tr></thead>
          <tbody>
            {(data ?? []).map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.created_at)}</td>
                <td>{entry.action.replaceAll("_", " ")}</td>
                <td>{entry.metric ?? entry.entity_type}</td>
                <td>{entry.change_amount == null ? "—" : `${Number(entry.change_amount) >= 0 ? "+" : ""}${entry.change_amount}`}</td>
                <td>{entry.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && <p className="host-empty">No audit events yet.</p>}
      </div>
    </div>
  );
}
