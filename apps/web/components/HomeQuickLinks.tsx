"use client";

import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "@/i18n/routing";

const QUICK_LINKS = [
  {
    href: "/doctors",
    title: "Find",
    highlight: "Doctors",
    description: "Consult verified doctors",
    image: "/assets/home/quick-doctor.jpg",
    color: "#1C63E7",
    bg: "#EAF2FF",
    active: true,
  },
  {
    href: "/clinics",
    title: "Explore",
    highlight: "Clinics",
    description: "Modern facilities nearby",
    image: "/assets/home/clinic-3d.jpg",
    color: "#0D9488",
    bg: "#E8F8F5",
    active: true,
  },
  {
    href: "/labs",
    title: "Explore",
    highlight: "Labs",
    description: "Diagnostic tests & reports",
    image: "/assets/home/labs-tubes.jpg",
    color: "#7656D6",
    bg: "#F4F0FF",
    active: true,
  },
  {
    href: "/hospitals",
    title: "Find",
    highlight: "Hospitals",
    description: "Trusted hospitals near you",
    image: "/assets/home/hospital-3d.jpg",
    color: "#D97706",
    bg: "#FFF8E8",
    active: false,
  },
];

export default function HomeQuickLinks() {
  return (
    <section
      className="
        mx-auto
        w-full
        max-w-7xl
        px-4
        py-4
        sm:px-5
        sm:py-5
        lg:px-8
        lg:py-7
        xl:py-8
      "
    >
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:gap-4
          lg:grid-cols-4
          lg:gap-5
          xl:gap-6
        "
      >
        {QUICK_LINKS.map((item) => {
          const cardContent = (
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[23px]
                bg-gradient-to-br
                from-[#252A67]
                via-[#3B4A8F]
                to-[#14B8A6]
                p-[2px]
                shadow-[0_8px_26px_rgba(15,23,42,0.07)]
                transition-all
                duration-300
                lg:hover:-translate-y-1
                lg:hover:shadow-[0_18px_42px_rgba(15,23,42,0.13)]
              "
            >
              <div
                className="
                  relative
                  flex
                  min-h-[210px]
                  flex-col
                  overflow-hidden
                  rounded-[21px]
                  p-3
                  sm:min-h-[225px]
                  sm:p-3.5
                  lg:min-h-[245px]
                  lg:p-4
                  xl:min-h-[255px]
                  xl:p-4.5
                "
                style={{
                  backgroundColor: item.bg,
                }}
              >
                {/* =========================================
                    BACKGROUND GLOW
                   ========================================= */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-36
                    w-36
                    rounded-full
                    bg-white/65
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover:scale-125
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-12
                    -left-12
                    h-28
                    w-28
                    rounded-full
                    bg-white/35
                    blur-3xl
                  "
                />

                {/* =========================================
                    PHOTO
                   ========================================= */}

                <div
                  className="
                    relative
                    h-[105px]
                    w-full
                    shrink-0
                    overflow-hidden
                    rounded-[17px]
                    border
                    border-white/70
                    bg-white/20
                    shadow-[0_5px_18px_rgba(15,23,42,0.09)]
                    sm:h-[115px]
                    lg:h-[135px]
                    xl:h-[145px]
                  "
                  style={{
                    background: `
                      radial-gradient(
                        circle at 50% 35%,
                        rgba(255,255,255,0.95),
                        transparent 68%
                      ),
                      ${item.bg}
                    `,
                  }}
                >
                  {/* Main image */}

                  <img
                    src={item.image}
                    alt={`${item.title} ${item.highlight}`}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      object-center
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-[1.045]
                      lg:object-contain
                      lg:p-0.5
                    "
                  />

                  {/* Image shine */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-10
                      bg-gradient-to-br
                      from-white/20
                      via-transparent
                      to-black/[0.045]
                    "
                  />

                  {/* Top highlight */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      top-0
                      z-10
                      h-1/2
                      bg-gradient-to-b
                      from-white/20
                      to-transparent
                    "
                  />

                  {/* Accent dot */}

                  <span
                    className="
                      absolute
                      right-2.5
                      top-2.5
                      z-20
                      h-2.5
                      w-2.5
                      rounded-full
                      border-2
                      border-white
                      shadow-[0_2px_7px_rgba(0,0,0,0.18)]
                    "
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  {/* =========================================
                      COMING SOON BADGE
                     ========================================= */}

                  {!item.active && (
                    <div
                      className="
                        absolute
                        bottom-2.5
                        left-2.5
                        z-30
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-white/80
                        bg-white/90
                        px-2.5
                        py-1
                        shadow-[0_4px_12px_rgba(15,23,42,0.10)]
                        backdrop-blur-md
                      "
                    >
                      <Clock3
                        className="h-3 w-3"
                        style={{
                          color: item.color,
                        }}
                        strokeWidth={2.5}
                      />

                      <span
                        className="
                          text-[8px]
                          font-extrabold
                          uppercase
                          tracking-[0.12em]
                          sm:text-[9px]
                        "
                        style={{
                          color: item.color,
                        }}
                      >
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* =========================================
                    CONTENT
                   ========================================= */}

                <div
                  className="
                    relative
                    mt-3
                    flex
                    flex-1
                    flex-col
                    lg:mt-3.5
                  "
                >
                  <h3
                    className="
                      text-[14px]
                      font-extrabold
                      leading-[1.2]
                      tracking-[-0.025em]
                      text-[#0F1B33]
                      sm:text-[15px]
                      lg:text-[16px]
                      xl:text-[17px]
                    "
                  >
                    {item.title}{" "}
                    <span
                      style={{
                        color: item.color,
                      }}
                    >
                      {item.highlight}
                    </span>
                  </h3>

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      max-w-[95%]
                      text-[10px]
                      font-medium
                      leading-[1.45]
                      text-slate-600
                      sm:text-[11px]
                      lg:text-[11px]
                      xl:text-[12px]
                    "
                  >
                    {item.description}
                  </p>
                </div>

                {/* =========================================
                    ARROW
                   ========================================= */}

                <div className="relative mt-2 flex justify-end">
                  {item.active ? (
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-white
                        shadow-[0_5px_14px_rgba(15,23,42,0.14)]
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:translate-x-0.5
                        lg:h-9
                        lg:w-9
                      "
                      style={{
                        backgroundColor: item.color,
                      }}
                    >
                      <ArrowRight
                        className="h-3.5 w-3.5 lg:h-4 lg:w-4"
                        strokeWidth={2.4}
                      />
                    </span>
                  ) : (
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        bg-white/55
                        shadow-sm
                        lg:h-9
                        lg:w-9
                      "
                      style={{
                        borderColor: `${item.color}30`,
                        color: item.color,
                      }}
                    >
                      <Clock3
                        className="h-3.5 w-3.5 lg:h-4 lg:w-4"
                        strokeWidth={2.2}
                      />
                    </span>
                  )}
                </div>

                {/* Bottom soft highlight */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-10
                    -left-10
                    h-24
                    w-24
                    rounded-full
                    bg-white/25
                    blur-3xl
                  "
                />
              </div>
            </div>
          );

          // Active cards navigate.
          if (item.active) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block"
              >
                {cardContent}
              </Link>
            );
          }

          // Coming-soon cards do NOT navigate.
          return (
            <div
              key={item.href}
              role="button"
              aria-disabled="true"
              className="block cursor-default"
            >
              {cardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}