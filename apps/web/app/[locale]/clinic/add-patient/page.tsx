"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  BadgeCheck,
  Award,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { api } from "@/lib/api";

// ============================================================
// HELPERS
// ============================================================

function getInitials(name?: string) {
  if (!name) return "DR";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Prevent:
// Dr. Dr. Biswajit
// Dr Dr Biswajit
// DR. DR. Biswajit
// dr. dr. Biswajit
//
// Always returns:
// Dr. Biswajit
function formatDoctorName(name?: string) {
  if (!name?.trim()) {
    return "Dr. Doctor";
  }

  const cleanName = name
    .trim()
    .replace(/^(dr\.?\s*)+/i, "")
    .trim();

  return cleanName ? `Dr. ${cleanName}` : "Dr. Doctor";
}

// ============================================================
// PAGE
// ============================================================

export default function ClinicAddPatientPage() {
  // ============================================================
  // STATE
  // ============================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState<any>(null);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [isCheckingPhone, setIsCheckingPhone] =
    useState(false);

  const [isExistingPatient, setIsExistingPatient] =
    useState(false);

  // ============================================================
  // FETCH CLINIC DOCTORS
  // ============================================================

  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
  } = useQuery({
    queryKey: ["clinicDoctors"],

    queryFn: async () => {
      const response = await api.get("/clinic/doctors");

      return response.data?.data?.doctors || [];
    },
  });

  // ============================================================
  // FILTER DOCTORS
  // ============================================================

  const filteredDoctors =
    doctorsData?.filter((doctor: any) => {
      const doctorName =
        doctor?.user?.name ||
        doctor?.name ||
        "";

      const specialization =
        doctor?.specialization ||
        doctor?.specialty ||
        "";

      const search =
        searchQuery.trim().toLowerCase();

      if (!search) {
        return true;
      }

      return (
        doctorName
          .toLowerCase()
          .includes(search) ||
        specialization
          .toLowerCase()
          .includes(search)
      );
    }) || [];

  // ============================================================
  // PHONE CHECK
  // ============================================================

  const handlePhoneChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length > 10) {
      return;
    }

    setPhone(value);

    if (value.length !== 10) {
      setIsExistingPatient(false);
      return;
    }

    setIsCheckingPhone(true);

    try {
      const response = await api.get(
        `/patient/search-by-phone?phone=${value}`
      );

      const patient =
        response.data?.data?.patient;

      if (patient) {
        setName(patient?.name || "");

        const patientAge =
          patient?.patientProfile?.age ??
          patient?.age ??
          "";

        setAge(
          patientAge !== ""
            ? String(patientAge)
            : ""
        );

        setIsExistingPatient(true);

        toast.success("Existing patient found");
      } else {
        setName("");
        setAge("");
        setIsExistingPatient(false);
      }
    } catch {
      setName("");
      setAge("");
      setIsExistingPatient(false);
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // ============================================================
  // ADD PATIENT TO QUEUE
  // ============================================================

  const addToQueueMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDoctor) {
        throw new Error(
          "Please select a doctor"
        );
      }

      return api.post("/appointments/walk-in", {
        doctorId: selectedDoctor.id,
        phone,
        name,
        age: Number(age),
      });
    },

    onSuccess: () => {
      toast.success(
        "Patient added to queue successfully!"
      );

      setPhone("");
      setName("");
      setAge("");

      setIsExistingPatient(false);
      setSelectedDoctor(null);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add patient to queue"
      );
    },
  });

  // ============================================================
  // ============================================================
  // PATIENT FORM
  // ============================================================
  // ============================================================

  if (selectedDoctor) {
    const avatarSrc =
      selectedDoctor?.user?.avatar ||
      selectedDoctor?.user?.profilePhoto ||
      selectedDoctor?.profilePhoto ||
      selectedDoctor?.avatar ||
      null;

    const doctorName = formatDoctorName(
      selectedDoctor?.user?.name ||
        selectedDoctor?.name
    );

    const specialization =
      selectedDoctor?.specialization ||
      selectedDoctor?.specialty ||
      "General";

    return (
      <div className="min-h-screen bg-[#fafbfc] px-3 py-5 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">

          {/* ==================================================
              BACK BUTTON
              ================================================== */}

          <button
            type="button"
            onClick={() =>
              setSelectedDoctor(null)
            }
            className="group mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#252a67]"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />

            Back to Doctor List
          </button>

          {/* ==================================================
              SELECTED DOCTOR
              ================================================== */}

          <div className="mb-6 rounded-[24px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_10px_30px_-15px_rgba(37,42,103,0.45)]">

            <div className="flex min-h-[84px] items-center gap-3 rounded-[22px] bg-white px-3.5 py-3.5 sm:gap-4 sm:px-5 sm:py-4">

              {/* ==================================================
                  SELECTED DOCTOR PHOTO

                  TOP IS NOT CROPPED
                  ================================================== */}

              <div className="relative shrink-0">

                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-[#252a67] sm:h-16 sm:w-16">

                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={doctorName}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-base font-bold text-white sm:text-xl">
                      {getInitials(
                        selectedDoctor?.user?.name ||
                          selectedDoctor?.name
                      )}
                    </div>
                  )}

                </div>

                <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500 p-0.5 text-white shadow-md" />

              </div>

              {/* ==================================================
                  SELECTED DOCTOR DETAILS
                  ================================================== */}

              <div className="min-w-0 flex-1">

                <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  {doctorName}
                </h2>

                <p className="mt-1 truncate text-xs font-medium text-slate-500 sm:text-sm">
                  {specialization}
                </p>

              </div>

            </div>
          </div>

          {/* ==================================================
              ADD PATIENT TO QUEUE
              ================================================== */}

          <div className="rounded-[26px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_14px_38px_-18px_rgba(37,42,103,0.45)]">

            <div className="overflow-hidden rounded-[24px] bg-white">

              {/* ==================================================
                  FORM HEADER
                  ================================================== */}

              <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-[#252a67]/[0.035] via-white to-[#14B8A6]/[0.05] px-5 py-5 sm:px-6 sm:py-5">

                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#14B8A6]/10 blur-3xl" />

                <div className="relative">

                  <div className="flex items-center gap-2.5">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#252a67] to-[#14B8A6] shadow-sm">

                      <Stethoscope className="h-4 w-4 text-white" />

                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Add Patient to Queue
                    </h1>

                  </div>

                  <p className="mt-2 pl-10 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    Enter patient details to add
                    them to this doctor's queue.
                  </p>

                </div>
              </div>

              {/* ==================================================
                  FORM
                  ================================================== */}

              <div className="space-y-5 p-5 sm:p-6">

                {/* ==================================================
                    MOBILE NUMBER
                    ================================================== */}

                <div>

                  <label
                    htmlFor="patient-phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Mobile Number
                  </label>

                  <div className="relative">

                    <input
                      id="patient-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                        isExistingPatient
                          ? "border-green-300 bg-green-50/60 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                          : "border-slate-200 hover:border-slate-300 focus:border-[#252a67] focus:ring-4 focus:ring-[#252a67]/10"
                      }`}
                    />

                    {isCheckingPhone && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">

                        <Loader2 className="h-5 w-5 animate-spin text-[#252a67]" />

                      </div>
                    )}

                  </div>

                  {isExistingPatient && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-600">

                      <BadgeCheck className="h-3.5 w-3.5 shrink-0" />

                      Patient details auto-filled
                      from database

                    </div>
                  )}

                </div>

                {/* ==================================================
                    PATIENT NAME
                    ================================================== */}

                <div>

                  <label
                    htmlFor="patient-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Patient Name
                  </label>

                  <input
                    id="patient-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter patient name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                      isExistingPatient
                        ? "border-green-300 bg-green-50/60 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-[#252a67] focus:ring-4 focus:ring-[#252a67]/10"
                    }`}
                  />

                </div>

                {/* ==================================================
                    AGE
                    ================================================== */}

                <div>

                  <label
                    htmlFor="patient-age"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Age
                  </label>

                  <input
                    id="patient-age"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="150"
                    placeholder="Enter patient age"
                    value={age}
                    onChange={(event) =>
                      setAge(event.target.value)
                    }
                    className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                      isExistingPatient
                        ? "border-green-300 bg-green-50/60 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-[#252a67] focus:ring-4 focus:ring-[#252a67]/10"
                    }`}
                  />

                </div>

                {/* ==================================================
                    SUBMIT
                    ================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    addToQueueMutation.mutate()
                  }
                  disabled={
                    phone.length !== 10 ||
                    !name.trim() ||
                    !age ||
                    addToQueueMutation.isPending
                  }
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] py-3.5 text-sm font-bold text-white shadow-[0_8px_22px_-8px_rgba(37,42,103,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(20,184,166,0.55)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >

                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-2">

                    {addToQueueMutation.isPending && (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    )}

                    {addToQueueMutation.isPending
                      ? "Adding to Queue..."
                      : "Confirm & Add to Queue"}

                  </span>

                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ============================================================
  // DOCTOR SELECTION SCREEN
  // ============================================================
  // ============================================================

  return (
    <div className="min-h-screen bg-[#fafbfc] px-3 py-4 sm:p-6 lg:p-8">

      <div className="mx-auto w-full max-w-6xl">

        {/* ==================================================
            PAGE TITLE
            ================================================== */}

        <div className="mb-5 sm:mb-7">

          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Select a Doctor
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Choose a doctor to add a patient to
            their queue.
          </p>

        </div>

        {/* ==================================================
            SEARCH
            ================================================== */}

        <div className="relative mb-5 sm:mb-7">

          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search doctor by name..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#252a67]/30 focus:ring-2 focus:ring-[#252a67]/15 sm:rounded-2xl sm:py-3.5 sm:pl-12 sm:text-sm"
          />

        </div>

        {/* ==================================================
            LOADING
            ================================================== */}

        {isLoadingDoctors ? (
          <div className="flex min-h-[280px] items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#252a67] border-t-transparent" />

              <p className="text-xs font-medium text-slate-400">
                Loading doctors...
              </p>

            </div>

          </div>
        ) : (
          <>
            {/* ==================================================
                DOCTOR GRID

                MOBILE: 2
                TABLET: 3
                DESKTOP: 4
                ================================================== */}

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">

              {filteredDoctors.map(
                (doctor: any) => {
                  const avatarSrc =
                    doctor?.user?.avatar ||
                    doctor?.user?.profilePhoto ||
                    doctor?.profilePhoto ||
                    doctor?.avatar ||
                    null;

                  const doctorName =
                    doctor?.user?.name ||
                    doctor?.name ||
                    "Doctor";

                  const displayName =
                    formatDoctorName(
                      doctorName
                    );

                  const specialization =
                    doctor?.specialization ||
                    doctor?.specialty ||
                    "General";

                  const experience = Number(
                    doctor?.experience ||
                      doctor?.yearsOfExperience ||
                      0
                  );

                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() =>
                        setSelectedDoctor(doctor)
                      }
                      className="group min-w-0 text-left"
                    >

                      {/* ==================================================
                          CARD BORDER
                          ================================================== */}

                      <div className="h-full rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_3px_14px_-6px_rgba(37,42,103,0.45)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_28px_-10px_rgba(20,184,166,0.4)] sm:p-[2px]">

                        <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-[15px] bg-white sm:rounded-[14px]">

                          {/* ==================================================
                              PHOTO

                              IMPORTANT:

                              object-top
                              ----------------
                              TOP = NO CROP

                              object-cover
                              ----------------
                              NO EMPTY SPACE

                              So if cropping is required,
                              browser crops mainly from
                              bottom instead of top.
                              ================================================== */}

                          <div className="relative h-[118px] w-full overflow-hidden bg-slate-100 sm:h-[150px]">

                            {avatarSrc ? (
                              <img
                                src={avatarSrc}
                                alt={displayName}
                                loading="lazy"
                                className="h-full w-full object-cover object-top"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-3xl font-bold text-white sm:text-4xl">
                                {getInitials(
                                  doctorName
                                )}
                              </div>
                            )}

                            {/* ==================================================
                                VERY SOFT BOTTOM OVERLAY
                                ================================================== */}

                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-black/10 to-transparent sm:h-9" />

                            {/* ==================================================
                                EXPERIENCE
                                ================================================== */}

                            {experience > 0 && (
                              <div className="absolute left-1.5 top-1.5 sm:left-2.5 sm:top-2.5">

                                <div className="flex items-center gap-0.5 rounded-full bg-[#252a67]/95 px-1.5 py-0.5 shadow-md ring-1 ring-white/20 backdrop-blur-sm sm:gap-1 sm:px-2 sm:py-1">

                                  <Award className="h-2.5 w-2.5 text-amber-300 sm:h-3 sm:w-3" />

                                  <span className="text-[8px] font-bold text-white sm:text-[10px]">
                                    {experience}+ yrs
                                  </span>

                                </div>
                              </div>
                            )}

                            {/* ==================================================
                                VERIFIED
                                ================================================== */}

                            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5">

                              <BadgeCheck className="h-4 w-4 rounded-full bg-blue-500 p-0.5 text-white shadow-md sm:h-5 sm:w-5" />

                            </div>

                          </div>

                          {/* ==================================================
                              DOCTOR INFORMATION
                              ================================================== */}

                          <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">

                            <h3 className="truncate text-xs font-bold text-slate-900 sm:text-base">
                              {displayName}
                            </h3>

                            <p className="mt-1 flex min-w-0 items-center gap-1 text-[9px] text-slate-500 sm:text-xs">

                              <Stethoscope className="h-3 w-3 shrink-0 text-[#14B8A6] sm:h-3.5 sm:w-3.5" />

                              <span className="truncate">
                                {specialization}
                              </span>

                            </p>

                            {/* ==================================================
                                VIEW PROFILE
                                ================================================== */}

                            <div className="mt-2.5 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 transition-all group-hover:bg-[#252a67]/[0.06] sm:mt-3 sm:px-3 sm:py-2">

                              <span className="truncate text-[8px] font-bold text-slate-600 transition-colors group-hover:text-[#252a67] sm:text-[11px]">
                                View Profile
                              </span>

                              <ArrowRight className="h-3 w-3 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-[#252a67] sm:h-3.5 sm:w-3.5" />

                            </div>

                          </div>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}

            </div>

            {/* ==================================================
                EMPTY STATE
                ================================================== */}

            {filteredDoctors.length === 0 && (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-4 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                  <Search className="h-6 w-6 text-slate-400" />

                </div>

                <p className="text-sm font-semibold text-slate-700">
                  No doctors found
                </p>

                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  No doctors match{" "}
                  <span className="font-medium">
                    "{searchQuery}"
                  </span>
                </p>

              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}