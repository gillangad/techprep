import { Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { canAccess } from "../utils/access";
import { SECTION_META } from "../utils/sections";
import Skeleton from "./Skeleton";

const trackStyles = {
  dsa: { color: "bg-blue-500", text: "text-blue-500" },
  sql: { color: "bg-purple-500", text: "text-purple-500 dark:text-purple-400" },
  "core-cs": { color: "bg-cyan-500", text: "text-cyan-500" },
  "system-design": { color: "bg-emerald-500", text: "text-emerald-500 dark:text-emerald-400" },
};

function ProgressOverview() {
  const { progress, loading, questions, plan } = useApp();

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-[#1f2937] dark:bg-[#0f172a]">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["DSA", "SQL", "Core CS", "System Design"].map((label) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 text-gray-500 dark:border-[#1f2937] dark:bg-[#0f172a] dark:text-[#94a3b8]">
              <p className="font-medium text-gray-900 dark:text-white">
                {label === "System Design" ? "System Design Mock Questions" : `${label} Interview Questions`}
              </p>
              <p className="mt-2 text-sm">No data available</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {progress.map((track) => {
          const style = trackStyles[track.section as keyof typeof trackStyles];
          const Icon = SECTION_META[track.section].icon;
          const percentage = track.total === 0 ? 0 : Math.round((track.completed / track.total) * 100);
          const locked = !canAccess(plan, track.section);

          return (
            <div
              key={track.section}
              className={`rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-[#1f2937] dark:bg-[#0f172a] dark:hover:border-[#374151] dark:hover:shadow-none ${
                locked ? "opacity-50" : ""
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${style.text}`} />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{track.label}</p>
                </div>
                {!locked && <p className="text-xl font-bold text-gray-900 dark:text-white">{percentage}%</p>}
              </div>

              {locked ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#94a3b8]">
                  <Lock className="h-4 w-4" />
                  <span>Upgrade to access</span>
                </div>
              ) : (
                <>
                  <div className="mb-2 h-2 w-full rounded-full bg-gray-200 dark:bg-[#334155]">
                    <div className={`h-2 rounded-full ${style.color}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-[#94a3b8]">
                    {track.completed} of {track.total} completed
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressOverview;
