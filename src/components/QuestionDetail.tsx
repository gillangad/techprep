import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronRight, Code, Lightbulb, Moon, Sun } from "lucide-react";
import { useApp } from "../context/AppContext";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

type QuestionDetailProps = {
  questionId: string;
  onBack: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
};

type Example = {
  input: string;
  output: string;
  explanation?: string;
};

type QuestionDetailData = {
  id: string;
  description: string;
  examples: Example[];
  hint: string;
  solution: {
    explanation: string;
    code: string;
  };
};

function getDifficultyClass(difficulty: "Easy" | "Medium" | "Hard") {
  if (difficulty === "Easy") return "bg-green-500/20 text-green-400";
  if (difficulty === "Medium") return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}

function QuestionDetail({ questionId, onBack, theme, onToggleTheme }: QuestionDetailProps) {
  const { questions, markQuestionCompleted, markQuestionNotCompleted } = useApp();
  const [detail, setDetail] = useState<QuestionDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const question = questions.find((q) => q.id === questionId);
  const isDailyChallenge = questionId.startsWith("dc-");

  const [fallbackQuestion, setFallbackQuestion] = useState<{
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    topic: string;
    section: string;
    completed?: boolean;
  } | null>(null);

  const [dcCompleted, setDcCompleted] = useState(false);

  const displayQuestion = question ?? fallbackQuestion;

  const isCompleted = isDailyChallenge ? dcCompleted : question?.status === "completed";

  const handleMarkCompleted = () => {
    if (isDailyChallenge) {
      setDcCompleted(true);
    } else {
      markQuestionCompleted(questionId);
    }
  };

  const handleUndoCompleted = () => {
    if (isDailyChallenge) {
      setDcCompleted(false);
    } else {
      markQuestionNotCompleted(questionId);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const apiBase = import.meta.env.PROD ? "/api" : "http://localhost:3001";
        const res = await fetch(`${apiBase}/question-details/${questionId}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setDetail(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchFallback = async () => {
      if (!question && questionId.startsWith("dc-")) {
        try {
          const apiBase = import.meta.env.PROD ? "/api" : "http://localhost:3001";
          const res = await fetch(`${apiBase}/daily-challenge/${questionId}`);
          if (res.ok) {
            const data = await res.json();
            setFallbackQuestion(data);
          }
        } catch { /* ignore */ }
      }
    };

    fetchDetail();
    fetchFallback();
  }, [questionId, question]);

  return (
    <div className="min-h-screen w-full bg-[#BDE6FF] p-6 lg:ml-64 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-blue-500 transition-all duration-200 hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-lg bg-gray-100 p-2 text-gray-700 transition-all duration-200 hover:bg-gray-200 dark:bg-[#1e293b] dark:text-white dark:hover:bg-[#334155]"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
            <Skeleton className="mb-4 h-5 w-1/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
      ) : (
        <>
          {displayQuestion && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayQuestion.title}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyClass(displayQuestion.difficulty)}`}>
                {displayQuestion.difficulty}
              </span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                {displayQuestion.topic}
              </span>
              <span className="rounded-full bg-gray-500/20 px-2.5 py-0.5 text-xs font-medium text-gray-400 dark:text-gray-300">
                {displayQuestion.section}
              </span>
              {question && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    question.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : question.status === "attempted"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {question.status === "completed" ? "Completed" : question.status === "attempted" ? "Attempted" : "Not Started"}
                </span>
              )}
            </div>
          )}

          {notFound ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
                <EmptyState message="Content coming soon! Check back later for the full problem details." />
              </div>

              <div className="flex">
                {isCompleted ? (
                  <button
                    type="button"
                    onClick={handleUndoCompleted}
                    className="flex items-center gap-2 rounded-lg bg-green-500/20 px-5 py-2.5 text-sm font-medium text-green-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Completed — Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkCompleted}
                    className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Problem Statement</h2>
                <p className="mb-4 text-gray-700 dark:text-[#94a3b8]">{detail?.description}</p>
                {detail?.examples.map((example, i) => (
                  <div key={i} className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#1f2937] dark:bg-[#0f172a]">
                    <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">Example {i + 1}:</p>
                    <p className="text-sm text-gray-700 dark:text-[#94a3b8]">
                      <span className="font-medium">Input:</span> {example.input}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-[#94a3b8]">
                      <span className="font-medium">Output:</span> {example.output}
                    </p>
                    {example.explanation && (
                      <p className="text-sm text-gray-700 dark:text-[#94a3b8]">
                        <span className="font-medium">Explanation:</span> {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Hint */}
              <div className="rounded-xl border border-gray-200 bg-white/80 dark:border-[#1f2937] dark:bg-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex w-full items-center gap-2 p-6 text-left"
                >
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Need a hint?</span>
                  {showHint ? (
                    <ChevronDown className="ml-auto h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showHint && (
                  <div className="border-t border-gray-200 px-6 pb-6 pt-4 dark:border-[#1f2937]">
                    <p className="text-gray-700 dark:text-[#94a3b8]">{detail?.hint}</p>
                  </div>
                )}
              </div>

              {/* Solution */}
              <div className="rounded-xl border border-gray-200 bg-white/80 dark:border-[#1f2937] dark:bg-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex w-full items-center gap-2 p-6 text-left"
                >
                  <Code className="h-5 w-5 text-blue-500" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Reveal Solution</span>
                  {showSolution ? (
                    <ChevronDown className="ml-auto h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  )}
                </button>
                {showSolution && (
                  <div className="border-t border-gray-200 px-6 pb-6 pt-4 dark:border-[#1f2937]">
                    <p className="mb-4 text-gray-700 dark:text-[#94a3b8]">{detail?.solution.explanation}</p>
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100 dark:bg-[#0f172a]">
                      <code>{detail?.solution.code}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="flex">
                {isCompleted ? (
                  <button
                    type="button"
                    onClick={handleUndoCompleted}
                    className="flex items-center gap-2 rounded-lg bg-green-500/20 px-5 py-2.5 text-sm font-medium text-green-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Completed — Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkCompleted}
                    className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default QuestionDetail;
