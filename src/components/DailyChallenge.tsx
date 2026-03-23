import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDailyChallenge } from "../api/mockApi";
import { useApp } from "../context/AppContext";
import type { DailyChallenge as DailyChallengeType } from "../types";
import { getQuestionDisplayTitle, getSectionName } from "../utils/sections";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

function getDifficultyClass(difficulty: "Easy" | "Medium" | "Hard") {
  if (difficulty === "Easy") return "bg-green-500/20 text-green-400";
  if (difficulty === "Medium") return "bg-yellow-500/20 text-yellow-400";
  return "bg-red-500/20 text-red-400";
}

function DailyChallenge() {
  const { openQuestion } = useApp();
  const [challenge, setChallenge] = useState<DailyChallengeType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const data = await fetchDailyChallenge();
        await new Promise((resolve) => setTimeout(resolve, 400));
        setChallenge(data);
      } catch (error) {
        console.error("Failed to load daily challenge", error);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Challenge</h2>
      </div>

      {loading ? (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-[#1f2937] dark:bg-[#0f172a]">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-9 w-1/3" />
        </div>
      ) : !challenge ? (
        <EmptyState message="No challenge available today" />
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-[#1f2937] dark:bg-[#0f172a]">
          <p className="font-medium text-gray-900 dark:text-white">
            {getQuestionDisplayTitle(challenge.section, challenge.title)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-500 dark:bg-[#334155] dark:text-[#94a3b8]">
              {challenge.topic}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-500 dark:bg-[#334155] dark:text-[#94a3b8]">
              {getSectionName(challenge.section)}
            </span>
            <span className={`rounded-full px-2 py-1 ${getDifficultyClass(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>

          <div className="mt-4">
            {challenge.completed ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">✅ Completed</span>
                <button
                  type="button"
                  onClick={() => setChallenge({ ...challenge, completed: false })}
                  className="text-sm text-gray-400 transition-all duration-200 hover:text-red-400"
                >
                  Undo
                </button>
              </div>
            ) : (
              <>
                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-400">Not Attempted</span>
                <button
                  type="button"
                  onClick={() => openQuestion(challenge.id)}
                  className="mt-4 block rounded-lg bg-[#001146] px-4 py-2 text-white transition-all duration-200 hover:brightness-125 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Start Challenge →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyChallenge;
