"use client";

export function RequestsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-3.5 w-80 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-44 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Requests Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-48 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-40 rounded-md bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="h-12 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-3.5 w-28 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
