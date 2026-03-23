import { BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getQuestionDisplayTitle } from "../utils/sections";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

function getDifficultyClass(difficulty: "Easy" | "Medium" | "Hard") {
  if (difficulty === "Easy") return "bg-green-500/20 text-green-400";
  if (difficulty === "Medium") return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}

function ContinueLearning() {
  const { questions, activeTab, loading, openQuestion } = useApp();

  const filteredByTab = activeTab === "all" ? questions : questions.filter((question) => question.section === activeTab);

  const recentQuestions = filteredByTab
    .filter((question) => question.status !== "not-started")
    .sort((a, b) => {
      const aTime = a.lastAttemptedAt ? new Date(a.lastAttemptedAt).getTime() : 0;
      const bTime = b.lastAttemptedAt ? new Date(b.lastAttemptedAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Continue Learning</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-[#1f2937] dark:bg-[#0f172a]">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : recentQuestions.length === 0 ? (
        <EmptyState message="No questions attempted yet. Start solving!" />
      ) : (
        <div className="space-y-3">
          {recentQuestions.map((question) => (
            <button
              key={question.id}
              type="button"
              onClick={() => openQuestion(question.id)}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-[#1f2937] dark:bg-[#0f172a] dark:hover:border-[#374151] dark:hover:shadow-none"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${getDifficultyClass(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <p className="mt-2 truncate font-medium text-gray-900 dark:text-white">
                    {getQuestionDisplayTitle(question.section, question.title)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-[#94a3b8]">{question.topic}</p>
                </div>
                <div className="text-right text-sm">
                  {question.status === "attempted" ? (
                    <span className="text-blue-500">Resume →</span>
                  ) : (
                    <span className="text-green-500">✅ Completed</span>
                  )}
                </div>
              </div>
            </button>
          ))}
          <button type="button" className="text-sm text-blue-500 transition-all duration-200 hover:text-blue-400">
            View all questions →
          </button>
        </div>
      )}
    </div>
  );
}

export default ContinueLearning;
