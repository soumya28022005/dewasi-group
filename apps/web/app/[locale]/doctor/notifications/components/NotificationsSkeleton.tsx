"use client";

export function NotificationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-72 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="h-9 w-44 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center md:justify-end">
            <div className="h-9 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-9 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-full rounded-md bg-slate-100 dark:bg-slate-800/60" />
              </div>
              <div className="h-4 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
