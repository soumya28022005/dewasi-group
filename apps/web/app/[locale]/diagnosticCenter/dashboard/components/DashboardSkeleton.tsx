export function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse sm:space-y-6">
      {/* =========================================================
          HEADER SKELETON
      ========================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">

          {/* Eyebrow */}
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-2.5 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Title */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-7 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-7 w-36 rounded-lg bg-slate-100 dark:bg-slate-800/80" />
          </div>

          {/* Subtitle */}
          <div className="mt-2 h-3.5 w-72 max-w-full rounded-md bg-slate-100 dark:bg-slate-800/70" />

          {/* Status row */}
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 rounded-md bg-slate-100 dark:bg-slate-800/70" />
            <div className="h-6 w-20 rounded-md bg-slate-100 dark:bg-slate-800/70" />
          </div>

        </div>

        {/* Refresh */}
        <div className="h-9 w-24 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>


      {/* =========================================================
          CENTER OVERVIEW SKELETON
      ========================================================== */}

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 p-[1.5px] dark:from-slate-700 dark:via-slate-600 dark:to-slate-700">

        <div className="rounded-[14px] bg-white p-4 sm:p-5 lg:p-6 dark:bg-slate-900">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            {/* Identity */}
            <div className="flex min-w-0 items-start gap-4">

              {/* Logo */}
              <div className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800" />

              {/* Details */}
              <div className="min-w-0 flex-1 space-y-2">

                <div className="h-2.5 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />

                <div className="h-6 w-52 max-w-full rounded-lg bg-slate-200 dark:bg-slate-800" />

                <div className="h-3.5 w-72 max-w-full rounded-md bg-slate-100 dark:bg-slate-800/70" />

              </div>

            </div>


            {/* Actions */}
            <div className="flex gap-2">

              <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />

              <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />

            </div>

          </div>


          {/* Information strip */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">

            <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60" />

            <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60" />

          </div>

        </div>


        {/* Footer */}
        <div className="flex gap-5 bg-slate-50/60 px-4 py-2.5 sm:px-5 lg:px-6 dark:bg-slate-950/20">

          <div className="h-2.5 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />

          <div className="h-2.5 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />

        </div>

      </section>


      {/* =========================================================
          STAFF SUMMARY SKELETON
      ========================================================== */}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-5 dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="mt-1.5 h-1.5 w-7 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="h-2.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />

        </div>


        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex h-full items-center gap-3 px-3.5">

                <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-2">
                  <div className="h-3.5 w-14 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-2.5 w-20 rounded-md bg-slate-100 dark:bg-slate-800/70" />
                </div>

              </div>
            </div>
          ))}

        </div>

      </section>


      {/* =========================================================
          QUICK ACTIONS SKELETON
      ========================================================== */}

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-5 dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="mt-1.5 h-1.5 w-7 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="h-2.5 w-14 rounded-full bg-slate-100 dark:bg-slate-800" />

        </div>


        {/* Actions */}
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">

          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-[68px] rounded-xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div className="flex h-full items-center gap-3 px-3.5">

                <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-2.5 w-36 max-w-full rounded-md bg-slate-100 dark:bg-slate-800/70" />
                </div>

                <div className="h-7 w-7 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800" />

              </div>
            </div>
          ))}

        </div>

      </section>
    </div>
  );
}