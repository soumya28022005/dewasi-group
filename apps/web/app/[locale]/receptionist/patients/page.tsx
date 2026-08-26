"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
} from "lucide-react";

import type { Gender, PatientSearchResult } from "@doctor-contract/shared";
import { useMyAssignedDoctors } from "@/lib/hooks/useReceptionist";
import {
  useSearchPatientByPhone,
  useCreateGuestPatient,
  useBookReceptionAppointment,
} from "@/lib/hooks/useReceptionist";

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data &&
    typeof err.response.data.message === "string"
  ) {
    return err.response.data.message;
  }
  return fallback;
}

export default function ReceptionistPatientsPage() {
  const { data: doctors } = useMyAssignedDoctors();

  const search = useSearchPatientByPhone();
  const createGuest = useCreateGuestPatient();
  const bookAppointment = useBookReceptionAppointment();

  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundPatient, setFoundPatient] = useState<PatientSearchResult | null>(null);

  const [guestName, setGuestName] = useState("");
  const [guestAge, setGuestAge] = useState("");
  const [guestGender, setGuestGender] = useState<Gender>("MALE");

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedDoctor = useMemo(
    () => (doctors ?? []).find((d) => d.id === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSearched(false);

    if (!phone.trim()) {
      setError("Enter a phone number to search.");
      return;
    }

    try {
      const patient = await search.mutateAsync(phone.trim());
      setFoundPatient(patient);
      setSearched(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to search for patient"));
    }
  }

  async function handleCreateGuest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!guestName.trim() || !guestAge) {
      setError("Name and age are required.");
      return;
    }

    try {
      const patient = await createGuest.mutateAsync({
        name: guestName.trim(),
        age: Number(guestAge),
        phone: phone.trim() || undefined,
        gender: guestGender,
      });
      setFoundPatient(patient);
      setSuccess("Guest patient registered.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to register guest patient"));
    }
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!foundPatient || !selectedDoctor?.clinic?.id) {
      setError("Select a patient and a doctor first.");
      return;
    }

    try {
      await bookAppointment.mutateAsync({
        doctorId: selectedDoctor.id,
        clinicId: selectedDoctor.clinic.id,
        date: bookingDate,
        bookingSource: "RECEPTION",
        patientId: foundPatient.id,
      });
      setSuccess("Appointment booked successfully.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to book appointment"));
    }
  }

  function resetFlow() {
    setPhone("");
    setSearched(false);
    setFoundPatient(null);
    setGuestName("");
    setGuestAge("");
    setSelectedDoctorId("");
    setError(null);
    setSuccess(null);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary-dark-text)]">Patients</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-ink-500">
          Search a patient by phone, register a walk-in guest, and book an appointment.
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-[11px] font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button type="button" onClick={resetFlow} className="text-[11px] font-bold underline">
            Start over
          </button>
        </div>
      )}

      {/* Step 1: Search */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-soft-300 dark:bg-surface">
        <h2 className="mb-3 text-sm font-bold text-gray-800 dark:text-ink-800">
          1. Search patient by phone
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 dark:border-soft-300 dark:bg-soft-50">
            <Phone className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9777777777"
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-ink-800"
            />
          </div>
          <button
            type="submit"
            disabled={search.isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
          >
            <Search className="h-3.5 w-3.5" />
            {search.isPending ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Step 2: Result */}
      {searched && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-soft-300 dark:bg-surface">
          {foundPatient ? (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-soft)] text-[var(--color-primary-text)]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-ink-800">
                  {foundPatient.user?.name || foundPatient.name || "Patient"}
                </p>
                <p className="text-xs text-gray-500 dark:text-ink-500">
                  {foundPatient.user?.phone || foundPatient.phone || phone}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-ink-700">
                No patient found with this phone number.
              </p>
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-ink-600">
                <UserPlus className="h-3.5 w-3.5" />
                Register as a walk-in guest
              </h3>
              <form onSubmit={handleCreateGuest} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:border-soft-300 dark:bg-soft-50 dark:text-ink-800"
                />
                <input
                  value={guestAge}
                  onChange={(e) => setGuestAge(e.target.value)}
                  type="number"
                  min={0}
                  placeholder="Age"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:border-soft-300 dark:bg-soft-50 dark:text-ink-800"
                />
                <select
                  value={guestGender}
                  onChange={(e) => setGuestGender(e.target.value as Gender)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none dark:border-soft-300 dark:bg-soft-50 dark:text-ink-800"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <button
                  type="submit"
                  disabled={createGuest.isPending}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {createGuest.isPending ? "Registering..." : "Register Guest"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Book */}
      {foundPatient && (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-soft-300 dark:bg-surface">
          <h2 className="mb-3 text-sm font-bold text-gray-800 dark:text-ink-800">
            2. Book an appointment
          </h2>
          <form onSubmit={handleBook} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none dark:border-soft-300 dark:bg-soft-50 dark:text-ink-800"
            >
              <option value="">Select doctor</option>
              {(doctors ?? []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user.name}
                  {d.clinic?.clinicName ? ` — ${d.clinic.clinicName}` : ""}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none dark:border-soft-300 dark:bg-soft-50 dark:text-ink-800"
            />
            <button
              type="submit"
              disabled={bookAppointment.isPending || !selectedDoctorId}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02] disabled:opacity-50 sm:col-span-2"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              {bookAppointment.isPending ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}