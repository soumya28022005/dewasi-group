export function StaffSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 rounded-lg bg-slate-100 dark:bg-slate-850" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Search & Filter Toolbar Skeleton */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-850" />
          <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-850" />
        </div>
        <div className="h-8 w-60 rounded-lg bg-slate-100 dark:bg-slate-850" />
      </div>

      {/* Staff Cards Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-36 rounded bg-slate-100 dark:bg-slate-850" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-md bg-slate-100 dark:bg-slate-850" />
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="h-3 w-44 rounded bg-slate-100 dark:bg-slate-850" />
              <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-850" />
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
