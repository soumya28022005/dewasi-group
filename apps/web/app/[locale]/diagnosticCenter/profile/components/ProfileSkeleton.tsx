export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-96 rounded-lg bg-slate-100 dark:bg-slate-850" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Logo Uploader Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-64 rounded-lg bg-slate-100 dark:bg-slate-850" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-2 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-80 rounded-lg bg-slate-100 dark:bg-slate-850" />
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          </div>

          <div className="space-y-1.5">
            <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <div className="h-9 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
