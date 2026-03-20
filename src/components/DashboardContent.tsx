import { Menu, Moon, Sun } from "lucide-react";
import { useApp } from "../context/AppContext";
import { canAccess } from "../utils/access";
import ContinueLearning from "./ContinueLearning";
import DailyChallenge from "./DailyChallenge";
import LeaderboardPreview from "./LeaderboardPreview";
import LockedOverlay from "./LockedOverlay";
import ProgressOverview from "./ProgressOverview";
import QuestionDetail from "./QuestionDetail";
import RecentActivity from "./RecentActivity";

type DashboardContentProps = {
  onMenuClick: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

function DashboardContent({ onMenuClick, theme, onToggleTheme }: DashboardContentProps) {
  const { plan, activeTab, selectedQuestionId, closeQuestion } = useApp();
  const hasAccess = canAccess(plan, activeTab);

  if (selectedQuestionId) {
    return <QuestionDetail questionId={selectedQuestionId} onBack={closeQuestion} theme={theme} onToggleTheme={onToggleTheme} />;
  }

  return (
    <main className="min-h-screen w-full bg-[#BDE6FF] p-6 lg:ml-64 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg bg-gray-100 p-2 text-gray-700 transition-all duration-200 hover:bg-gray-200 lg:hidden dark:bg-[#1e293b] dark:text-white dark:hover:bg-[#334155]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back!</h2>
          <p className="text-gray-500 dark:text-[#94a3b8]">Here's your learning progress</p>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="ml-auto rounded-lg bg-gray-100 p-2 text-gray-700 transition-all duration-200 hover:bg-gray-200 dark:bg-[#1e293b] dark:text-white dark:hover:bg-[#334155]"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>

      {!hasAccess ? (
        <LockedOverlay section={activeTab} plan={plan} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ProgressOverview />
          </div>
          <ContinueLearning />
          <DailyChallenge />
          <LeaderboardPreview />
          <RecentActivity />
        </div>
      )}
    </main>
  );
}

export default DashboardContent;
