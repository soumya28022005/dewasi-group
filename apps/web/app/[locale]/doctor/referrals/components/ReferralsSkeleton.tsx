"use client";

export function ReferralsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-6 w-56 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-72 rounded-md bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="h-9 w-72 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Referral Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-24 rounded-md bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
              <div className="h-7 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-slate-800" />
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
