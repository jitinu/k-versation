import { QuestionForm } from "@/components/questions/QuestionForm";
export const metadata = { title: "Questions", description: "Ask K-VERSATION a question." };
export default function Questions() {
  return (
    <div data-theme="ivory" className="page section-gap">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">Ask something</p>
          <h1 className="mt-6 text-5xl tracking-[-0.03em] md:text-7xl">Questions</h1>
          <p className="text-ink-2 mt-8 max-w-md text-lg normal-case">
            Have a story, question, or idea? Send it our way.
          </p>
        </div>
        <QuestionForm />
      </div>
    </div>
  );
}
