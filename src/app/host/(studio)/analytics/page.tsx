import { MetricAdjuster } from "@/components/metric-adjuster";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getPublicMetrics } from "@/lib/data";
import { formatCompactNumber, formatDate } from "@/lib/format";

export default async function AnalyticsPage() {
  const admin = createAdminSupabaseClient();
  const [metrics, mediaResult, adjustmentResult, eventsResult] = await Promise.all([
    getPublicMetrics(),
    admin ? admin.from("media_items").select("id, title").order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
    admin ? admin.from("metric_adjustments").select("*").order("updated_at", { ascending: false }) : Promise.resolve({ data: [] }),
    admin ? admin.from("analytics_events").select("event_type, created_at").order("created_at", { ascending: false }).limit(20) : Promise.resolve({ data: [] }),
  ]);
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Measurement</p><h2>Analytics</h2></div>
        <p>Verified system events remain separate from every host adjustment.</p>
      </div>
      <div className="analytics-summary">
        {[
          ["Impressions", metrics.siteImpressions],
          ["Meaningful views", metrics.totalVideoViews],
          ["Members", metrics.totalMembers],
          ["Countries", metrics.countriesReached],
        ].map(([label, count]) => <div key={label}><strong>{formatCompactNumber(Number(count))}</strong><span>{label}</span></div>)}
      </div>
      <section className="host-card">
        <div className="host-card-heading">
          <div><p className="eyebrow">Manual controls</p><h3>Adjust displayed metrics</h3></div>
          <p>Displayed = verified + adjustment, clamped at zero.</p>
        </div>
        <MetricAdjuster targets={mediaResult.data ?? []} />
      </section>
      <div className="host-split">
        <section className="host-card">
          <h3>Current adjustments</h3>
          <div className="compact-list">
            {(adjustmentResult.data ?? []).map((item) => (
              <div key={item.id}><span>{item.metric.replaceAll("_", " ")}</span><strong>{Number(item.adjustment) >= 0 ? "+" : ""}{item.adjustment}</strong></div>
            ))}
            {!adjustmentResult.data?.length && <p>No adjustments recorded.</p>}
          </div>
        </section>
        <section className="host-card">
          <h3>Latest verified events</h3>
          <div className="compact-list">
            {(eventsResult.data ?? []).map((event, index) => (
              <div key={`${event.created_at}-${index}`}><span>{event.event_type.replaceAll("_", " ")}</span><time>{formatDate(event.created_at)}</time></div>
            ))}
            {!eventsResult.data?.length && <p>No events recorded.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
