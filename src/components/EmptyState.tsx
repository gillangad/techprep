import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  message: string;
  icon?: ReactNode;
};

function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 text-gray-400 dark:text-[#6b7280]">{icon || <Inbox className="h-12 w-12" />}</div>
      <p className="text-sm text-gray-500 dark:text-[#94a3b8]">{message}</p>
    </div>
  );
}

export default EmptyState;
