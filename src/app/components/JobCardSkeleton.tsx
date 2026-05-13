import { Skeleton } from './ui/skeleton';

export function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-2/3" />

        {/* Company */}
        <Skeleton className="h-4 w-1/2" />

        {/* Location and type */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Salary */}
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function JobCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </>
  );
}
