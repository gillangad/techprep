import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/mockApi";
import type { LeaderboardUser } from "../types";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

function getRankLabel(rank: number) {
  return `#${rank}`;
}

function LeaderboardPreview() {
  const [allUsers, setAllUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        await new Promise((resolve) => setTimeout(resolve, 400));
        setAllUsers(data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const users = expanded ? allUsers : allUsers.slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leaderboard</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : allUsers.length === 0 ? (
        <EmptyState message="No leaderboard data available" />
      ) : (
        <div>
          {users.map((user, index) => (
            <div
              key={`${user.rank}-${user.name}`}
              className={`flex items-center justify-between py-3 ${index !== users.length - 1 ? "border-b border-gray-200 dark:border-[#1f2937]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-sm text-gray-500 dark:text-[#94a3b8]">{getRankLabel(user.rank)}</span>
                <span className="text-gray-900 dark:text-white">{user.name}</span>
              </div>
              <span className="font-semibold text-blue-500">{user.score}</span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-sm text-blue-500 transition-all duration-200 hover:text-blue-400"
          >
            {expanded ? "← Show Less" : "View Full Leaderboard →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPreview;
