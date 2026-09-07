import type { Metadata } from "next";
import { QuestionForm } from "@/components/question-form";
import { getViewer } from "@/lib/data";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Send Daniel Koo a question, subject idea, or perspective for a future K-VERSATION.",
  alternates: { canonical: "/questions" },
};

export default async function QuestionsPage() {
  const viewer = await getViewer();
  return (
    <div className="questions-page">
      <header className="page-intro">
        <p className="eyebrow">Start an exchange</p>
        <h1>Questions</h1>
        <p>
          What would you like to understand about Korea? Send a question,
          propose a subject, or share a perspective worth exploring.
        </p>
      </header>
      <div className="questions-layout">
        <aside>
          <span>01</span>
          <h2>Every thoughtful question is a possible beginning.</h2>
          <p>
            Submissions are reviewed by Daniel and may inform a future
            Conversation or Dispatch.
          </p>
          <a href="mailto:thekversation@gmail.com">thekversation@gmail.com</a>
        </aside>
        <QuestionForm viewer={viewer} />
      </div>
    </div>
  );
}
