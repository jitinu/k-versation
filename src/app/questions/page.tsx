import { QuestionForm } from "@/components/questions/QuestionForm";
export const metadata = { title: "Questions", description: "Ask K-VERSATION a question." };
export default function Questions() {
  return (
    <div className="page section-gap pt-40">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h1 className="text-6xl">Questions</h1>
          <p className="text-ink-2 mt-8 max-w-md text-lg normal-case">
            Have a story, question, or idea? Send it our way.
          </p>
        </div>
        <QuestionForm />
      </div>
    </div>
  );
}
