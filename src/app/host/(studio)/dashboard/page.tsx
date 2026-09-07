import Link from "next/link";
import { getHostOverview } from "@/lib/data";
import { formatCompactNumber } from "@/lib/format";

export default async function DashboardPage() {
  const overview = await getHostOverview();
  const stats = [
    ["Site impressions", overview.siteImpressions, "/host/analytics"],
    ["Meaningful views", overview.totalVideoViews, "/host/analytics"],
    ["Members", overview.totalMembers, "/host/members"],
    ["Countries reached", overview.countriesReached, "/host/analytics"],
    ["Published + draft films", overview.conversations + overview.dispatches, "/host/content"],
    ["Questions received", overview.questions, "/host/questions"],
    ["Comments", overview.comments, "/host/comments"],
    ["Reactions", overview.reactions, "/host/analytics"],
  ] as const;
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Overview</p><h2>Publication pulse</h2></div>
        <p>Verified activity and explicitly audited adjustments, in one view.</p>
      </div>
      <div className="host-stat-grid">
        {stats.map(([label, value, href], index) => (
          <Link href={href} key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{formatCompactNumber(value)}</strong>
            <p>{label}</p>
          </Link>
        ))}
      </div>
      <div className="host-quick-grid">
        <Link href="/host/content"><p className="eyebrow">Publish</p><h3>Create the next film</h3><span>Open content studio →</span></Link>
        <Link href="/host/comments"><p className="eyebrow">Moderate</p><h3>Review the exchange</h3><span>Open comments →</span></Link>
        <Link href="/host/questions"><p className="eyebrow">Listen</p><h3>Read audience questions</h3><span>Open inbox →</span></Link>
      </div>
    </div>
  );
}
