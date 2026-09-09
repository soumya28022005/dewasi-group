"use client";

export function PrescriptionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-60 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-80 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="h-9 w-72 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-44 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Prescription Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3.5 w-28 rounded-md bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="h-7 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
