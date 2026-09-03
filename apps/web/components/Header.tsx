"use client";

import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth-context";
import { Link, useRouter } from "@/i18n/routing";

import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";
import LiveDoctorsButton from "./LiveDoctorsButton"; // NEW: Imported LiveDoctorsButton

export default function Header() {
  const t = useTranslations("HomePage");
  const nav = useTranslations("Navbar");
  const dash = useTranslations("Dashboard");

  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isClinic = user?.role === "CLINIC";
  const isDoctor = user?.role === "DOCTOR";
  const isDiagnosticCenter = user?.role === "DIAGNOSTIC_CENTER";
  const isDiagnosticStaff = user?.role === "DIAGNOSTIC_STAFF";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isAdmin = user?.role === "ADMIN";
  const isReceptionist = user?.role === "RECEPTIONIST";
  
  const dashboardHref = isClinic
    ? "/clinic"
    : isDoctor
      ? "/doctor/dashboard"
      : isDiagnosticCenter
        ? "/diagnosticCenter/dashboard"
        : isDiagnosticStaff
          ? "/diagnosticCenter/referrals"
          : isSuperAdmin
            ? "/super_admin/dashboard"
            : isAdmin
              ? "/admin/dashboard"
              : isReceptionist
                ? "/receptionist/dashboard"
                : "/patient";
                
  const dashboardLabel = isClinic
    ? dash("clinicPanel")
    : isDoctor
      ? dash("doctorPanel")
      : isDiagnosticCenter
        ? "Diagnostic Portal"
        : isDiagnosticStaff
          ? "Referrals Inbox"
          : isSuperAdmin
            ? "Super Admin"
            : isAdmin
              ? "Admin Portal"
              : isReceptionist
                ? "Receptionist Portal"
                : dash("dashboard");

  async function handleLogout() {
    await logout();
    setOpen(false);
    setShowUserMenu(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors dark:border-soft-300/80 dark:bg-surface/95">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 ring-1 ring-blue-100 transition duration-300 group-hover:scale-105 group-hover:shadow-md dark:from-blue-500/10 dark:to-cyan-500/10 dark:ring-blue-400/10">
            <Image
              src="/logo-icon.png"
              alt="Doctor Contact"
              width={36}
              height={36}
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:rotate-1"
              priority
            />
          </div>

          <Image
            src="/LOGO.png"
            alt="Doctor Contact"
            width={130}
            height={36}
            className="h-8 w-auto object-contain sm:h-9"
            priority
          />
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-2.5 md:flex">
          {/* Available Doctors */}
          <Link
            href="/doctors/available"
            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {nav("availableDoctors")}
          </Link>

          {/* Available Clinics */}
          <Link
            href="/clinics/available"
            className="rounded-full border border-blue-200 bg-blue-50/50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-blue-300"
          >
            {nav("availableClinics")}
          </Link>

          {/* Apply for Listing */}
          <Link
            href="/#clinics"
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400/20 dark:border-soft-300 dark:bg-transparent dark:text-ink-700 dark:hover:bg-soft-50"
          >
            {nav("applyForListing")}
          </Link>

          {/* Divider */}
          <span className="mx-1 h-7 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent dark:via-soft-300" />

          {/* Language */}
          <LanguageSwitcher />

          {/* NEW: Real-Time Live Doctors Indicator (Replaced ThemeToggle) */}
          <LiveDoctorsButton />

          {/* Notification Bell - Desktop */}
          {user && <NotificationBell />}

          {/* ================= USER ================= */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full border border-transparent px-2.5 py-1.5 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:hover:border-soft-300 dark:hover:bg-soft-50"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/20 ring-2 ring-white dark:ring-surface">
                  <span className="text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>

                {/* Name */}
                <span className="hidden text-sm font-medium text-gray-700 lg:block dark:text-ink-700">
                  {user.name}
                </span>

                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* ================= USER DROPDOWN ================= */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 py-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-soft-300 dark:bg-surface/95">
                  {/* Dashboard */}
                  <Link
                    href={dashboardHref}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-slate-50 dark:text-ink-700 dark:hover:bg-soft-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {dashboardLabel}
                  </Link>

                  {/* Profile — patients only */}
                  {!isClinic && !isDoctor && !isDiagnosticCenter && !isDiagnosticStaff && !isAdmin && !isSuperAdmin && (
                    <Link
                      href="/patient/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-slate-50 dark:text-ink-700 dark:hover:bg-soft-50"
                    >
                      <User className="h-4 w-4" />
                      {dash("profile")}
                    </Link>
                  )}

                  <hr className="my-1 border-gray-100 dark:border-soft-100" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {dash("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ================= GUEST DESKTOP ================= */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10"
              >
                {t("login")}
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex items-center gap-2 md:hidden">
          {/* NEW: Real-Time Live Doctors Indicator (Mobile) */}
          <LiveDoctorsButton />

          {/* Notification Bell - Mobile */}
          {user && <NotificationBell />}

          {/* Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-soft-300 dark:text-ink-600 dark:hover:bg-soft-100"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="border-t border-slate-200/80 bg-white/98 shadow-[0_16px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden dark:border-soft-300 dark:bg-surface/98">
          <div className="space-y-2.5 px-4 py-4 sm:px-6">
            {user ? (
              <>
                {/* ================= MOBILE USER INFO ================= */}
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/60 p-3.5 dark:border-soft-100 dark:from-soft-50 dark:to-blue-500/5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
                    <span className="font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800 dark:text-ink-800">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {isClinic
                        ? "Clinic"
                        : isDoctor
                          ? "Doctor"
                          : isDiagnosticCenter
                            ? "Diagnostic Center"
                            : isDiagnosticStaff
                              ? "Diagnostic Staff"
                              : isAdmin
                                ? user.role === "SUPER_ADMIN"
                                  ? "Super Admin"
                                  : "Admin"
                                : "Patient"}
                    </p>
                  </div>
                </div>

                {/* ================= AVAILABLE DOCTORS ================= */}
                <Link
                  href="/doctors/available"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600"
                >
                  {nav("availableDoctors")}
                </Link>

                {/* ================= AVAILABLE CLINICS ================= */}
                <Link
                  href="/clinics/available"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-blue-300"
                >
                  {nav("availableClinics")}
                </Link>

                {/* ================= APPLY FOR LISTING ================= */}
                <Link
                  href="/#clinics"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-slate-50 dark:border-soft-300 dark:bg-transparent dark:text-ink-700 dark:hover:bg-soft-50"
                >
                  {nav("applyForListing")}
                </Link>

                {/* ================= DASHBOARD ================= */}
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 dark:text-ink-700 dark:hover:bg-soft-50"
                >
                  <LayoutDashboard className="mr-2 inline h-4 w-4" />
                  {dashboardLabel}
                </Link>

                {/* ================= PROFILE (patients only) ================= */}
                {!isClinic && !isDoctor && !isDiagnosticCenter && !isDiagnosticStaff && !isAdmin && !isSuperAdmin && (
                  <Link
                    href="/patient/profile"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-slate-50 dark:text-ink-700 dark:hover:bg-soft-50"
                  >
                    <User className="mr-2 inline h-4 w-4" />
                    {dash("profile")}
                  </Link>
                )}

                <hr className="border-gray-100 dark:border-soft-100" />

                {/* ================= LOGOUT ================= */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  {dash("logout")}
                </button>
              </>
            ) : (
              <>
                {/* ================= GUEST MOBILE ================= */}
                <Link
                  href="/doctors/available"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600"
                >
                  {nav("availableDoctors")}
                </Link>

                <Link
                  href="/clinics"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-blue-300"
                >
                  {nav("availableClinics")}
                </Link>

                <Link
                  href="/#clinics"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-slate-50 dark:border-soft-300 dark:bg-transparent dark:text-ink-700 dark:hover:bg-soft-50"
                >
                  {nav("applyForListing")}
                </Link>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-soft-300 dark:text-ink-700 dark:hover:bg-soft-50"
                  >
                    {t("login")}
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {t("register")}
                  </Link>
                </div>
              </>
            )}

            <div className="pt-3 text-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}