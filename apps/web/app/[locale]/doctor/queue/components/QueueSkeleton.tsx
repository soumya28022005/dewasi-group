"use client";

export function QueueSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-3.5 w-72 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-9 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Metrics Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-28"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-7 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-28 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Current Patient & Controls Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4 h-64">
          <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-16 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-4 w-full rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4 h-64">
          <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            ))}
          </div>
        </div>
      </div>

      {/* Queue Table Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
