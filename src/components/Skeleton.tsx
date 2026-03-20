type SkeletonProps = {
  className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`h-4 rounded-lg bg-gray-200 animate-pulse dark:bg-[#334155] ${className}`} />;
}

export default Skeleton;
