import { Skeleton } from "@/components/global/ui/skeleton";

// Skeleton specifically for HeaderNav component
function HeaderNavSkeleton({ tabCount = 4 }: { tabCount?: number }) {
  return (
    <div className="flex items-center gap-[22px] overflow-auto">
      {Array.from({ length: tabCount }).map((_, index) => (
        <Skeleton key={index} className="h-[32px] w-[80px] rounded-md" />
      ))}
    </div>
  );
}

// Skeleton for the entire StatusManager structure
function StatusManagerSkeleton() {
  return (
    <div className="flex items-center justify-between w-full gap-[28px]">
      {/* Main content skeleton - matches the title/editable header area */}
      <Skeleton className="h-[36px] w-[50%] flex-1" />

      {/* HeaderNav skeleton - matches the tab navigation */}
      <HeaderNavSkeleton />
    </div>
  );
}

export { StatusManagerSkeleton };
