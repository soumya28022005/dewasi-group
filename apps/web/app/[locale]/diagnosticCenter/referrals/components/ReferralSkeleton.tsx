export function ReferralSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 rounded-lg bg-slate-100 dark:bg-slate-850" />
        </div>
        <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Search Toolbar Skeleton */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="h-9 w-full sm:w-96 rounded-lg bg-slate-100 dark:bg-slate-850" />
        <div className="h-4 w-32 rounded bg-slate-100 dark:bg-slate-850" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-850" />
                </div>
              </div>
              <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-850" />
            </div>

            <div className="mt-4 h-16 rounded-lg bg-slate-50 dark:bg-slate-800/50" />

            <div className="mt-4 space-y-1.5">
              <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-850" />
              <div className="flex gap-1.5">
                <div className="h-5 w-16 rounded bg-slate-100 dark:bg-slate-850" />
                <div className="h-5 w-20 rounded bg-slate-100 dark:bg-slate-850" />
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
