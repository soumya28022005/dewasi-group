export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 rounded-lg bg-slate-100 dark:bg-slate-850" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Center Overview Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2.5 flex-1">
            <div className="h-6 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-72 rounded-lg bg-slate-100 dark:bg-slate-850" />
            <div className="h-5 w-28 rounded-md bg-slate-100 dark:bg-slate-850" />
          </div>
        </div>
      </div>

      {/* Staff Summary Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/60"
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="h-5 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}
