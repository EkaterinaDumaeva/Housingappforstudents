import { Skeleton } from './ui/skeleton';

export function HousingCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Location */}
        <Skeleton className="h-4 w-1/2" />

        {/* Host info */}
        <Skeleton className="h-4 w-2/3" />

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function HousingCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <HousingCardSkeleton key={i} />
      ))}
    </>
  );
}
