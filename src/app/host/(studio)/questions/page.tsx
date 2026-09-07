import { QuestionStatus } from "@/components/host-actions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export default async function HostQuestionsPage() {
  const admin = createAdminSupabaseClient();
  const { data } = admin
    ? await admin.from("questions").select("*").order("created_at", { ascending: false }).limit(500)
    : { data: [] };
  return (
    <div className="host-page">
      <div className="host-section-heading">
        <div><p className="eyebrow">Inbox</p><h2>Questions</h2></div>
        <p>Audience prompts, subject ideas, and possible beginnings for future films.</p>
      </div>
      <div className="question-inbox">
        {(data ?? []).map((question) => (
          <article key={question.id}>
            <header>
              <div><strong>{question.name}</strong><a href={`mailto:${question.email}`}>{question.email}</a></div>
              <div><time>{formatDate(question.created_at)}</time><QuestionStatus id={question.id} current={question.status} /></div>
            </header>
            {question.subject && <p className="eyebrow">{question.subject}</p>}
            <p>{question.question}</p>
          </article>
        ))}
        {!data?.length && <p className="host-empty">No questions yet.</p>}
      </div>
    </div>
  );
}
