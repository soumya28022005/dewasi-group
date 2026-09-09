"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-72 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="h-7 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-28"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-7 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-24 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="h-3.5 w-64 rounded-md bg-slate-100 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}
