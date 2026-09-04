import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, Stethoscope, FlaskConical, Radio, Languages, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return { title: `${t("metaTitle")} · Doctor Contact`, description: t("heroSubtitle") };
}

const audienceIcons = [Users, Stethoscope, FlaskConical] as const;
const valueIcons = [Radio, Languages, ShieldCheck] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");

  const audiences = t.raw("audiences") as { title: string; body: string }[];
  const values = t.raw("values") as { title: string; body: string }[];

  return (
    <main className="bg-white dark:bg-[var(--color-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-[var(--color-bg-soft)] dark:border-soft-200">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:py-24">
          <p className="text-sm font-medium text-[var(--color-secondary-dark-text)]">
            {t("kicker")}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--color-primary-dark-text)] sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-ink-600">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-lg leading-8 text-gray-700 dark:text-ink-700">{t("storyP1")}</p>
        <p className="mt-5 text-lg leading-8 text-gray-700 dark:text-ink-700">{t("storyP2")}</p>
      </section>

      {/* Who it's for */}
      <section className="border-t border-gray-100 bg-[var(--color-bg-soft)] px-5 py-16 dark:border-soft-200">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-[var(--color-primary-dark-text)]">{t("audienceHeading")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {audiences.map((item, i) => {
              const Icon = audienceIcons[i] ?? Users;
              const accent = i === 1 ? "secondary" : "primary";
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 dark:border-soft-300 dark:bg-surface"
                >
                  <span
                    className={
                      accent === "secondary"
                        ? "flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-secondary-light)] text-[var(--color-secondary-dark-text)]"
                        : "flex h-10 w-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_12%,white)] text-[var(--color-primary-text)]"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-ink-600">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark-text)]">{t("valuesHeading")}</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {values.map((item, i) => {
            const Icon = valueIcons[i] ?? ShieldCheck;
            return (
              <div key={item.title}>
                <Icon className="h-5 w-5 text-[var(--color-primary-text)]" />
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-ink-600">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Company + CTA */}
      <section className="border-t border-gray-100 px-5 py-16 dark:border-soft-200">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-2xl border border-gray-200 bg-[var(--color-bg-soft)] p-8 dark:border-soft-300 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-ink-500">{t("companyLine")}</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-primary-dark-text)]">Dewasi Group</p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </main>
  );
}
