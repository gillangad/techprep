import { Lock } from "lucide-react";
import type { Plan, Section } from "../types";

type LockedOverlayProps = {
  section: Section;
  plan: Plan;
};

function LockedOverlay({ section, plan }: LockedOverlayProps) {
  const requiredPlan = section === "core-cs" ? "Premium" : "Pro";

  return (
    <div className="flex min-h-[70vh] items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-[#1f2937] dark:bg-[#1e293b]">
      <div className="max-w-md">
        <Lock className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-[#6b7280]" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Upgrade to access</h2>
        <p className="mb-6 text-gray-500 dark:text-[#94a3b8]">
          This section requires a {requiredPlan} plan or higher. You are currently on the {plan.toUpperCase()} plan.
        </p>
        <button
          type="button"
          onClick={() => alert("Switch plans from the sidebar to unlock this section.")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-500"
        >
          Upgrade to access
        </button>
      </div>
    </div>
  );
}

export default LockedOverlay;
