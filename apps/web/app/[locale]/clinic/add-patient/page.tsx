"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Search,
  Loader2,
  BadgeCheck,
  Award,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ============================================================
// HELPERS
// ============================================================

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ClinicAddPatientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isExistingPatient, setIsExistingPatient] = useState(false);

  // ============================================================
  // GET CLINIC DOCTORS
  // ============================================================

  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
  } = useQuery({
    queryKey: ["clinicDoctors"],
    queryFn: async () => {
      const response = await api.get("/clinic/doctors");
      return response.data.data.doctors;
    },
  });

  // ============================================================
  // SEARCH FILTER
  // ============================================================

  const filteredDoctors = doctorsData?.filter((doc: any) => {
    const doctorName = doc.user?.name || "";

    return doctorName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // ============================================================
  // PHONE AUTO-FILL
  // ============================================================

  const handlePhoneChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value.replace(/\D/g, "");

    if (val.length > 10) return;

    setPhone(val);

    if (val.length === 10) {
      setIsCheckingPhone(true);

      try {
        const res = await api.get(
          `/patient/search-by-phone?phone=${val}`
        );

        if (res.data.data?.patient) {
          const foundPatient = res.data.data.patient;

          setName(foundPatient.name);

          setAge(
            foundPatient.patientProfile?.age?.toString() || ""
          );

          setIsExistingPatient(true);

          toast.success("Existing patient found!");
        } else {
          setName("");
          setAge("");
          setIsExistingPatient(false);
        }
      } catch (error) {
        setName("");
        setAge("");
        setIsExistingPatient(false);
      } finally {
        setIsCheckingPhone(false);
      }
    } else {
      setIsExistingPatient(false);
    }
  };

  // ============================================================
  // ADD TO QUEUE
  // ============================================================

  const addToQueueMutation = useMutation({
    mutationFn: async () => {
      return await api.post("/appointments/walk-in", {
        doctorId: selectedDoctor.id,
        phone,
        name,
        age: Number(age),
      });
    },

    onSuccess: () => {
      toast.success("Patient added to queue successfully!");

      setPhone("");
      setName("");
      setAge("");
      setIsExistingPatient(false);
      setSelectedDoctor(null);
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to add patient to queue"
      );
    },
  });

  // ============================================================
  // STEP 2 — PATIENT FORM
  // ============================================================

  if (selectedDoctor) {
    const avatarSrc =
      selectedDoctor.user?.avatar ||
      selectedDoctor.profilePhoto;

    return (
      <div className="min-h-screen bg-[#fafbfc] px-4 py-5 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">

          {/* Back Button */}
          <button
            onClick={() => setSelectedDoctor(null)}
            className="group mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#252a67]"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />

            Back to Doctor List
          </button>

          {/* Selected Doctor */}
          <div className="mb-7 rounded-3xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[2px] shadow-lg">
            <div className="flex items-center gap-4 rounded-[calc(1.5rem-2px)] bg-white p-4 sm:p-5">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-[#252a67] sm:h-16 sm:w-16">

                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={selectedDoctor.user.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-lg font-bold text-white sm:text-xl">
                      {getInitials(selectedDoctor.user.name)}
                    </div>
                  )}

                </div>

                <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500 p-0.5 text-white shadow" />
              </div>

              {/* Info */}
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  Dr. {selectedDoctor.user.name}
                </h2>

                <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
                  {selectedDoctor.specialization || "General"}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Add Patient to Queue
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Enter patient details to add them to this doctor's queue.
            </p>
          </div>

          {/* Patient Form */}
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            {/* Mobile Number */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mobile Number
              </label>

              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full rounded-xl border px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#252a67] ${
                    isExistingPatient
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-white"
                  }`}
                  value={phone}
                  onChange={handlePhoneChange}
                />

                {isCheckingPhone && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2
                      className="animate-spin text-[#252a67]"
                      size={20}
                    />
                  </div>
                )}
              </div>

              {isExistingPatient && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-green-600">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Patient details auto-filled from database
                </p>
              )}
            </div>

            {/* Patient Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Patient Name
              </label>

              <input
                type="text"
                placeholder="Enter patient name"
                className={`w-full rounded-xl border px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#252a67] ${
                  isExistingPatient
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200 bg-white"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Age
              </label>

              <input
                type="number"
                min="0"
                placeholder="Enter patient age"
                className={`w-full rounded-xl border px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#252a67] ${
                  isExistingPatient
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200 bg-white"
                }`}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              onClick={() => addToQueueMutation.mutate()}
              disabled={
                phone.length !== 10 ||
                !name ||
                !age ||
                addToQueueMutation.isPending
              }
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#14B8A6] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {addToQueueMutation.isPending && (
                <Loader2
                  className="animate-spin"
                  size={19}
                />
              )}

              {addToQueueMutation.isPending
                ? "Adding to Queue..."
                : "Confirm & Add to Queue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // STEP 1 — DOCTOR SELECTION
  // ============================================================

  return (
    <div className="min-h-screen bg-[#fafbfc] px-3 py-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* ======================================================
            HEADER
            ====================================================== */}

        <div className="mb-5 sm:mb-7">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Select a Doctor
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Choose a doctor to add a patient to their queue.
          </p>
        </div>

        {/* ======================================================
            SEARCH
            ====================================================== */}

        <div className="relative mb-5 sm:mb-7">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />

          <input
            type="text"
            placeholder="Search doctor by name..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#252a67]/30 focus:ring-2 focus:ring-[#252a67]/15 sm:rounded-2xl sm:py-3.5 sm:pl-12 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ======================================================
            LOADING
            ====================================================== */}

        {isLoadingDoctors ? (
          <div className="flex min-h-[250px] items-center justify-center">
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

                IMPORTANT:
                Mobile = ALWAYS 2 columns
                Tablet = 3 columns
                Desktop = 4 columns
                ================================================== */}

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">

              {filteredDoctors?.map((doc: any) => {
                const avatarSrc =
                  doc.user?.avatar ||
                  doc.profilePhoto;

                const experience =
                  doc.experience || 0;

                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className="group min-w-0 text-left"
                  >
                    {/* ==================================================
                        OUTER PREMIUM BORDER
                        ================================================== */}

                    <div className="h-full rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_3px_12px_-5px_rgba(37,42,103,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_25px_-8px_rgba(20,184,166,0.35)] sm:rounded-2xl sm:p-[2px]">

                      <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-[calc(1rem-1.5px)] bg-white sm:rounded-[calc(1rem-2px)]">

                        {/* ==================================================
                            PHOTO

                            object-contain = FULL IMAGE VISIBLE
                            No top/bottom cropping
                            ================================================== */}

                        <div className="relative h-28 w-full overflow-hidden bg-slate-100 sm:h-36">

                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={doc.user.name}
                              className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-3xl font-bold text-white sm:text-4xl">
                              {getInitials(doc.user.name)}
                            </div>
                          )}

                          {/* Soft bottom fade */}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent sm:h-10" />

                          {/* ==================================================
                              EXPERIENCE BADGE
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
                            <BadgeCheck className="h-4.5 w-4.5 rounded-full bg-blue-500 p-0.5 text-white shadow-md sm:h-5 sm:w-5" />
                          </div>
                        </div>

                        {/* ==================================================
                            DOCTOR INFORMATION
                            ================================================== */}

                        <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">

                          {/* Name */}
                          <h3 className="truncate text-xs font-bold text-slate-900 sm:text-base">
                            Dr. {doc.user.name}
                          </h3>

                          {/* Specialization */}
                          <p className="mt-1 flex min-w-0 items-center gap-1 text-[9px] text-slate-500 sm:text-xs">

                            <Stethoscope className="h-3 w-3 shrink-0 text-[#14B8A6] sm:h-3.5 sm:w-3.5" />

                            <span className="truncate">
                              {doc.specialization || "General"}
                            </span>
                          </p>

                          {/* ==================================================
                              VIEW PROFILE
                              ================================================== */}

                          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 transition-colors group-hover:bg-blue-50 sm:mt-3 sm:px-3 sm:py-2">

                            <span className="truncate text-[8px] font-bold text-slate-600 transition-colors group-hover:text-blue-600 sm:text-[11px]">
                              View Profile
                            </span>

                            <ArrowRight className="h-3 w-3 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600 sm:h-3.5 sm:w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ======================================================
            EMPTY STATE
            ====================================================== */}

        {!isLoadingDoctors &&
          filteredDoctors?.length === 0 && (
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
      </div>
    </div>
  );
}