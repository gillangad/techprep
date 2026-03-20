import { Activity as ActivityIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchActivities } from "../api/mockApi";
import type { Activity } from "../types";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

function getDotColor(type: Activity["type"]) {
  if (type === "solved") return "bg-blue-400";
  if (type === "completed-topic") return "bg-green-400";
  if (type === "streak") return "bg-amber-400";
  return "bg-blue-400";
}

function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetchActivities();
        await new Promise((resolve) => setTimeout(resolve, 400));
        setActivities(data);
      } catch (error) {
        console.error("Failed to load activities", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-6 dark:border-[#1f2937] dark:bg-[#1e293b]">
      <div className="mb-4 flex items-center gap-2">
        <ActivityIcon className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-4 w-full" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState message="No recent activity" />
      ) : (
        <div>
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between gap-3 py-3 ${index !== activities.length - 1 ? "border-b border-gray-200 dark:border-[#1f2937]" : ""}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${getDotColor(activity.type)}`} />
                <p className="truncate text-gray-900 dark:text-white">{activity.message}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-[#6b7280]">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
