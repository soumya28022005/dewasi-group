"use client";

export function ScheduleSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-3.5 w-80 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Clinic Selector Skeleton */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-48 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="h-9 w-52 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Top 2-Column Cards Grid: Consultation Time & Delay Notification */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Consultation Time Card Skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1">
              <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-48 rounded-md bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="h-16 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-12 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            ))}
          </div>
          <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-9 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Delay Notification Card Skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1">
              <div className="h-4 w-44 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-56 rounded-md bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="h-14 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-14 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            ))}
          </div>
          <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          <div className="h-9 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Bottom 2-Column Grid: Calendar & Leave List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-64 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
