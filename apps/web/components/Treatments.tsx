"use client";

import { Link } from "@/i18n/routing";
import SectionHeader from "@/components/SectionHeader";

const TREATMENTS = [
  {
    name: "Homeopathy",
    desc: "Gentle healing",
    image: "/assets/home/treatment-homeopathy.jpg",
    href: "/doctors?treatment=Homeopathy",
    gradient: "from-[#243E8F] via-[#258FA0] to-[#16A3A0]",
  },
  {
    name: "Allopathy",
    desc: "Modern medicine",
    image: "/assets/home/treatment-allopathy.jpg",
    href: "/doctors?treatment=Allopathy",
    gradient: "from-[#243E8F] via-[#248D9A] to-[#12A99A]",
  },
  {
    name: "Ayurveda",
    desc: "Natural balance",
    image: "/assets/home/treatment-ayurveda.jpg",
    href: "/doctors?treatment=Ayurveda",
    gradient: "from-[#304080] via-[#98752E] to-[#16A37A]",
  },
];

export default function Treatments() {
  return (
    <section
      id="treatments"
      className="
        mx-auto
        w-full
        max-w-7xl
        border-b border-slate-100
        px-5
        py-6
        sm:px-6
        lg:px-8
        lg:py-7
        dark:border-soft-200
      "
    >
      {/* Section Header */}
      <SectionHeader
        title="Treatments & Systems"
        subtitle="Holistic & specialized healthcare"
      />

      {/* =====================================================
          EXACTLY 3 CARDS
          Mobile: 3 side-by-side
          Tablet: 3 side-by-side
          Desktop: 3 side-by-side
          No horizontal scrolling
      ====================================================== */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
        {TREATMENTS.map((treatment) => (
          <Link
            key={treatment.name}
            href={treatment.href}
            className="
              group
              relative
              min-w-0
              overflow-hidden
              rounded-[17px]
              p-[2px]
              bg-gradient-to-br
              shadow-[0_6px_18px_rgba(15,27,51,0.08)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_12px_28px_rgba(15,27,51,0.14)]
              active:scale-[0.98]
            "
          >
            {/* Gradient Border */}
            <div
              className={`
                absolute
                inset-0
                rounded-[17px]
                bg-gradient-to-br
                ${treatment.gradient}
              `}
            />

            {/* Card */}
            <div
              className="
                relative
                h-[126px]
                overflow-hidden
                rounded-[15px]
                bg-slate-100

                sm:h-[155px]

                md:h-[165px]

                lg:h-[178px]

                xl:h-[185px]
              "
            >
              {/* Image */}
              <img
                src={treatment.image}
                alt={treatment.name}
                loading="lazy"
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
                  group-hover:scale-[1.07]
                "
              />

              {/* Image Darkening */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-b
                  from-black/[0.02]
                  via-black/[0.08]
                  to-[#07162F]/90
                "
              />

              {/* Bottom Content */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  px-2
                  pb-2.5
                  pt-7

                  sm:px-3
                  sm:pb-3
                  sm:pt-9
                "
              >
                <h3
                  className="
                    truncate
                    text-[11px]
                    font-extrabold
                    leading-tight
                    tracking-[-0.01em]
                    text-white
                    drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]

                    sm:text-sm

                    md:text-[15px]

                    lg:text-base
                  "
                >
                  {treatment.name}
                </h3>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[8px]
                    font-medium
                    leading-tight
                    text-white/80

                    sm:text-[10px]

                    md:text-[11px]
                  "
                >
                  {treatment.desc}
                </p>
              </div>

              {/* Top-right indicator */}
              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-white
                  shadow-[0_0_0_3px_rgba(255,255,255,0.18)]

                  sm:right-2.5
                  sm:top-2.5
                  sm:h-2
                  sm:w-2
                "
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}