import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export default async function MembersPage() {
  const admin = createAdminSupabaseClient();
  const { data } = admin
    ? await admin.from("profiles").select("id, name, username, email, country_code, phone, created_at").order("created_at", { ascending: false }).limit(500)
    : { data: [] };
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Community</p><h2>Members</h2></div>
        <p>Private contact details are available only inside this protected host view.</p>
      </div>
      <div className="host-table-wrap">
        <table className="host-table">
          <thead><tr><th>Member</th><th>Email</th><th>Country</th><th>Phone</th><th>Joined</th></tr></thead>
          <tbody>
            {(data ?? []).map((member) => (
              <tr key={member.id}>
                <td><strong>{member.name}</strong><span>@{member.username}</span></td>
                <td><a href={`mailto:${member.email}`}>{member.email}</a></td>
                <td>{member.country_code}</td>
                <td>{member.phone ?? "—"}</td>
                <td>{formatDate(member.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.length && <p className="host-empty">No members yet.</p>}
      </div>
    </div>
  );
}
