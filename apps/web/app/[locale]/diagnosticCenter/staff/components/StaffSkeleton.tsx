export function StaffSkeleton() {
  return (
    <div className="space-y-5">
      {/* =========================================
          Header Skeleton
      ========================================= */}

      <div
        className="
          relative
          flex
          flex-col
          gap-5
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200/80
          bg-white
          px-5
          py-5
          shadow-[0_8px_35px_-20px_rgba(15,23,42,0.16)]
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        {/* Top Accent */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-[2px]
            bg-slate-200
            dark:bg-slate-800
          "
        />

        <div className="flex items-center gap-3.5">
          {/* Header Icon */}
          <div
            className="
              h-11
              w-11
              shrink-0
              animate-pulse
              rounded-2xl
              bg-slate-200
              dark:bg-slate-800
            "
          />

          {/* Header Text */}
          <div className="space-y-2">
            <div
              className="
                h-5
                w-40
                animate-pulse
                rounded-lg
                bg-slate-200
                dark:bg-slate-800
              "
            />

            <div
              className="
                h-3
                w-64
                animate-pulse
                rounded-md
                bg-slate-100
                dark:bg-slate-900
              "
            />
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <div
            className="
              h-10
              w-24
              animate-pulse
              rounded-xl
              bg-slate-100
              dark:bg-slate-900
            "
          />

          <div
            className="
              h-10
              w-32
              animate-pulse
              rounded-xl
              bg-slate-200
              dark:bg-slate-800
            "
          />
        </div>
      </div>

      {/* =========================================
          Toolbar Skeleton
      ========================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[22px]
          border
          border-slate-200/80
          bg-white
          p-3
          shadow-[0_6px_30px_-18px_rgba(15,23,42,0.16)]
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        {/* Accent */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-slate-200
            dark:bg-slate-800
          "
        />

        <div
          className="
            flex
            flex-col
            gap-3
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {/* Filter Icon */}
            <div
              className="
                hidden
                h-9
                w-9
                animate-pulse
                rounded-xl
                bg-slate-100
                sm:block
                dark:bg-slate-900
              "
            />

            {/* Tabs */}
            <div
              className="
                flex
                items-center
                gap-1
                rounded-xl
                bg-slate-50
                p-0.5
                dark:bg-slate-900
              "
            >
              <div
                className="
                  h-9
                  w-24
                  animate-pulse
                  rounded-xl
                  bg-slate-200
                  dark:bg-slate-800
                "
              />

              <div
                className="
                  h-9
                  w-20
                  animate-pulse
                  rounded-xl
                  bg-slate-100
                  dark:bg-slate-900
                "
              />

              <div
                className="
                  h-9
                  w-20
                  animate-pulse
                  rounded-xl
                  bg-slate-100
                  dark:bg-slate-900
                "
              />
            </div>
          </div>

          {/* Search */}
          <div
            className="
              h-9
              w-full
              animate-pulse
              rounded-xl
              bg-slate-100
              lg:w-[280px]
              xl:w-[320px]
              dark:bg-slate-900
            "
          />
        </div>
      </div>

      {/* =========================================
          Staff Cards
      ========================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
          2xl:grid-cols-4
        "
      >
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <StaffCardSkeleton
              key={index}
            />
          ),
        )}
      </div>
    </div>
  );
}

/* =============================================
   Individual Staff Card Skeleton
============================================= */

function StaffCardSkeleton() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-slate-200/80
        bg-white
        p-4
        shadow-[0_8px_30px_-18px_rgba(15,23,42,0.16)]
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      {/* Premium shimmer */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -translate-x-full
          animate-[shimmer_2s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/50
          to-transparent
          dark:via-white/[0.03]
        "
      />

      {/* =======================================
          Card Header
      ======================================= */}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}
          <div
            className="
              h-11
              w-11
              shrink-0
              animate-pulse
              rounded-2xl
              bg-slate-200
              dark:bg-slate-800
            "
          />

          {/* Name + Email */}
          <div className="min-w-0 space-y-2">
            <div
              className="
                h-3.5
                w-28
                animate-pulse
                rounded-md
                bg-slate-200
                dark:bg-slate-800
              "
            />

            <div
              className="
                h-2.5
                w-36
                animate-pulse
                rounded-md
                bg-slate-100
                dark:bg-slate-900
              "
            />
          </div>
        </div>

        {/* Status */}
        <div
          className="
            h-5
            w-16
            shrink-0
            animate-pulse
            rounded-full
            bg-slate-100
            dark:bg-slate-900
          "
        />
      </div>

      {/* =======================================
          Contact Details
      ======================================= */}

      <div
        className="
          relative
          mt-4
          space-y-3
          border-t
          border-slate-100
          pt-4
          dark:border-slate-800
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              h-3.5
              w-3.5
              shrink-0
              animate-pulse
              rounded-md
              bg-slate-100
              dark:bg-slate-900
            "
          />

          <div
            className="
              h-3
              w-44
              animate-pulse
              rounded-md
              bg-slate-100
              dark:bg-slate-900
            "
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className="
              h-3.5
              w-3.5
              shrink-0
              animate-pulse
              rounded-md
              bg-slate-100
              dark:bg-slate-900
            "
          />

          <div
            className="
              h-3
              w-32
              animate-pulse
              rounded-md
              bg-slate-100
              dark:bg-slate-900
            "
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className="
              h-3.5
              w-3.5
              shrink-0
              animate-pulse
              rounded-md
              bg-slate-100
              dark:bg-slate-900
            "
          />

          <div
            className="
              h-2.5
              w-28
              animate-pulse
              rounded-md
              bg-slate-100
              dark:bg-slate-900
            "
          />
        </div>
      </div>

      {/* =======================================
          Action
      ======================================= */}

      <div
        className="
          relative
          mt-4
          border-t
          border-slate-100
          pt-3
          dark:border-slate-800
        "
      >
        <div
          className="
            h-9
            w-full
            animate-pulse
            rounded-xl
            bg-slate-100
            dark:bg-slate-900
          "
        />
      </div>
    </div>
  );
}
