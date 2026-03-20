import { Binary, Code2, Cpu, Database, LayoutList, Lock } from "lucide-react";
import type { ComponentType } from "react";
import { useApp } from "../context/AppContext";
import type { Plan, Section } from "../types";
import { canAccess } from "../utils/access";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const tabs: Array<{ label: string; section: Section; icon: ComponentType<{ className?: string }> }> = [
  { label: "DSA Interview Questions", section: "dsa", icon: Binary },
  { label: "SQL Interview Questions", section: "sql", icon: Database },
  { label: "Core CS Interview Questions", section: "core-cs", icon: Cpu },
  { label: "All Interview Questions", section: "all", icon: LayoutList },
];

function getPlanBadgeClass(plan: Plan) {
  if (plan === "free") return "bg-blue-500/20 text-blue-500";
  if (plan === "pro") return "bg-blue-500/20 text-blue-500";
  return "bg-amber-500/20 text-amber-500";
}

function Sidebar({ open, onClose }: SidebarProps) {
  const { plan, setPlan, activeTab, setActiveTab } = useApp();

  const handleTabClick = (section: Section) => {
    setActiveTab(section);
    onClose();
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white p-4 shadow-sm transition-transform duration-200 dark:border-[#1f2937] dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#111827] dark:shadow-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 border-b border-gray-200 pb-4 dark:border-[#1f2937]">
          <div className="mb-3 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TechPrep</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-[#94a3b8]">Current Plan</p>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getPlanBadgeClass(plan)}`}>
              {plan.toUpperCase()}
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const locked = !canAccess(plan, tab.section);
            const active = activeTab === tab.section;

            return (
              <button
                key={tab.section}
                type="button"
                onClick={() => handleTabClick(tab.section)}
                className={`flex w-full items-center justify-between rounded-lg border-l-4 px-3 py-2 text-left text-sm transition-all duration-200 ${
                  active
                    ? "border-blue-500 bg-blue-50 text-gray-900 dark:bg-[#1e293b] dark:text-white"
                    : "border-transparent text-gray-600 hover:bg-gray-100 dark:text-[#94a3b8] dark:hover:bg-[#1e293b]/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </span>
                {locked && <Lock className="h-4 w-4 text-gray-400 dark:text-[#6b7280]" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-[#1f2937]">
          <p className="text-sm text-gray-900 dark:text-white">Switch Plan</p>
          <p className="mb-3 text-xs text-gray-400 dark:text-[#6b7280]">(for demo)</p>
          <div className="grid grid-cols-3 gap-2">
            {(["free", "pro", "premium"] as Plan[]).map((planOption) => (
              <button
                key={planOption}
                type="button"
                onClick={() => setPlan(planOption)}
                className={`rounded-lg px-2 py-2 text-xs capitalize transition-all duration-200 ${
                  plan === planOption
                    ? "bg-[#001146] text-white hover:brightness-125 dark:bg-blue-600 dark:hover:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#334155] dark:text-[#f9fafb] dark:hover:bg-[#374151]"
                }`}
              >
                {planOption}
              </button>
            ))}
          </div>
        </div>


      </aside>
    </>
  );
}

export default Sidebar;
