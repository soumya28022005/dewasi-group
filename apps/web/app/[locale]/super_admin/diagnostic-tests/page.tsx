"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Check,
  Edit2,
  FlaskConical,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useGlobalTests,
  useAdminAddGlobalTest,
  useAdminUpdateGlobalTest,
  useAdminDeleteGlobalTest,
  type DiagnosticTest,
} from "@/lib/hooks/useDiagnosticCenter";

interface TestFormValues {
  name: string;
  description: string;
  isActive: boolean;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null
  ) {
    const value = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      value.response?.data?.message ||
      value.message ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

export default function AdminGlobalTestsPage() {
  const {
    data: tests = [],
    isLoading,
    isFetching,
  } = useGlobalTests();

  const addMutation = useAdminAddGlobalTest();
  const updateMutation = useAdminUpdateGlobalTest();
  const deleteMutation = useAdminDeleteGlobalTest();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingTest, setEditingTest] =
    useState<DiagnosticTest | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestFormValues>({
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const isSaving =
    addMutation.isPending ||
    updateMutation.isPending;

  const filteredTests = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return tests;
    }

    return tests.filter((test) => {
      const name =
        test.name?.toLowerCase() ?? "";

      const description =
        test.description?.toLowerCase() ?? "";

      return (
        name.includes(query) ||
        description.includes(query)
      );
    });
  }, [tests, searchQuery]);

  const activeCount = tests.filter(
    (test) => test.isActive,
  ).length;

  const inactiveCount =
    tests.length - activeCount;

  const openAddModal = () => {
    setEditingTest(null);

    reset({
      name: "",
      description: "",
      isActive: true,
    });

    setIsModalOpen(true);
  };

  const openEditModal = (
    test: DiagnosticTest,
  ) => {
    setEditingTest(test);

    reset({
      name: test.name ?? "",
      description:
        test.description ?? "",
      isActive: Boolean(test.isActive),
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingTest(null);

    reset({
      name: "",
      description: "",
      isActive: true,
    });
  };

  const onSubmit = async (
    data: TestFormValues,
  ) => {
    const name = data.name.trim();
    const description =
      data.description.trim();

    if (!name) {
      toast.error(
        "Please enter a test name.",
      );
      return;
    }

    try {
      if (editingTest) {
        await updateMutation.mutateAsync({
          id: editingTest.id,
          payload: {
            name,
            description,
            isActive: Boolean(
              data.isActive,
            ),
          },
        });

        toast.success(
          "Test updated successfully!",
        );
      } else {
        await addMutation.mutateAsync({
          name,
          description,
          isActive: Boolean(
            data.isActive,
          ),
        });

        toast.success(
          "Test added successfully!",
        );
      }

      closeModal();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error),
      );
    }
  };

  const handleDelete = async (
    id: string,
  ) => {
    const test = tests.find(
      (item) => item.id === id,
    );

    const testName =
      test?.name || "this test";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${testName}" globally? Diagnostic centers may no longer be able to add it.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteMutation.mutateAsync(id);

      toast.success(
        "Test deleted successfully!",
      );
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error),
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="w-full space-y-5 p-4 sm:p-6">
        <div className="h-32 animate-pulse rounded-[24px] border border-slate-200 bg-white" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[20px] border border-slate-200 bg-white"
              />
            ),
          )}
        </div>

        <div className="h-16 animate-pulse rounded-[20px] border border-slate-200 bg-white" />

        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white">
          <div className="space-y-3 p-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-100"
                />
              ),
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full space-y-5 p-4 pb-10 sm:p-6">
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-[0_12px_45px_-28px_rgba(15,23,42,0.28)] sm:px-7">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
              <FlaskConical
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Admin Console
                </span>

                {isFetching &&
                  !isLoading && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Updating
                    </span>
                  )}
              </div>

              <h1 className="text-xl font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                Global Diagnostic Tests
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                Create and manage the master test
                catalog available to diagnostic
                centers across the platform.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-950
              px-4
              text-xs
              font-bold
              text-white
              shadow-[0_10px_25px_-12px_rgba(15,23,42,0.7)]
              transition-all
              hover:-translate-y-px
              hover:bg-slate-800
              active:translate-y-0
            "
          >
            <Plus
              className="h-4 w-4"
              strokeWidth={2}
            />
            Add Test
          </button>
        </div>
      </section>

      {/* =========================================
          STATISTICS
      ========================================= */}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_7px_30px_-22px_rgba(15,23,42,0.2)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                Total Tests
              </p>

              <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">
                {tests.length}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FlaskConical className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-emerald-100 bg-white p-4 shadow-[0_7px_30px_-22px_rgba(15,23,42,0.2)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-600">
                Active
              </p>

              <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">
                {activeCount}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Check className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_7px_30px_-22px_rgba(15,23,42,0.2)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                Inactive
              </p>

              <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">
                {inactiveCount}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <X className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SEARCH TOOLBAR
      ========================================= */}

      <section className="rounded-[21px] border border-slate-200 bg-white p-3.5 shadow-[0_7px_30px_-20px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Test Catalog
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              {filteredTests.length}{" "}
              {filteredTests.length === 1
                ? "result"
                : "results"}
            </p>
          </div>

          <div className="relative w-full sm:w-[300px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.8}
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value,
                )
              }
              placeholder="Search tests..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-3
                text-xs
                font-medium
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                hover:border-slate-300
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
              "
            />
          </div>
        </div>
      </section>

      {/* =========================================
          DESKTOP TABLE
      ========================================= */}

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_40px_-25px_rgba(15,23,42,0.22)]">
        {filteredTests.length === 0 ? (
          <div className="flex min-h-[330px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
              <Search
                className="h-6 w-6"
                strokeWidth={1.6}
              />
            </div>

            <h2 className="mt-4 text-sm font-bold text-slate-900">
              {searchQuery
                ? "No tests found"
                : "No global tests yet"}
            </h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
              {searchQuery
                ? "Try another search term or clear the search."
                : "Create your first global diagnostic test to make it available to diagnostic centers."}
            </p>

            {!searchQuery && (
              <button
                type="button"
                onClick={openAddModal}
                className="
                  mt-5
                  inline-flex
                  h-9
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                <Plus className="h-3.5 w-3.5" />
                Create First Test
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Test
                    </th>

                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Description
                    </th>

                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTests.map(
                    (test) => {
                      const isDeleting =
                        deletingId ===
                        test.id;

                      return (
                        <tr
                          key={test.id}
                          className="group transition-colors hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                                <FlaskConical
                                  className="h-4 w-4"
                                  strokeWidth={1.8}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[260px] truncate text-xs font-bold text-slate-900">
                                  {test.name}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  Global test
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="max-w-[360px] px-6 py-4">
                            <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                              {test.description ||
                                "No description provided."}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            {test.isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    test,
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-transparent
                                  text-slate-400
                                  transition
                                  hover:border-blue-100
                                  hover:bg-blue-50
                                  hover:text-blue-600
                                  disabled:opacity-40
                                "
                                aria-label={`Edit ${test.name}`}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    test.id,
                                  )
                                }
                                disabled={
                                  isDeleting
                                }
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-transparent
                                  text-slate-400
                                  transition
                                  hover:border-rose-100
                                  hover:bg-rose-50
                                  hover:text-rose-600
                                  disabled:opacity-40
                                "
                                aria-label={`Delete ${test.name}`}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>

            {/* =====================================
                MOBILE LIST
            ===================================== */}

            <div className="divide-y divide-slate-100 md:hidden">
              {filteredTests.map(
                (test) => {
                  const isDeleting =
                    deletingId === test.id;

                  return (
                    <div
                      key={test.id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                            <FlaskConical className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {test.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Global test
                            </p>
                          </div>
                        </div>

                        {test.isActive ? (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        {test.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-4 flex justify-end gap-1.5 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              test,
                            )
                          }
                          disabled={isDeleting}
                          className="
                            flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-slate-50
                            px-3
                            text-[10px]
                            font-bold
                            text-slate-600
                            transition
                            hover:bg-blue-50
                            hover:text-blue-600
                          "
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              test.id,
                            )
                          }
                          disabled={isDeleting}
                          className="
                            flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-slate-50
                            px-3
                            text-[10px]
                            font-bold
                            text-slate-600
                            transition
                            hover:bg-rose-50
                            hover:text-rose-600
                          "
                        >
                          {isDeleting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </>
        )}
      </section>

      {/* =========================================
          ADD / EDIT MODAL
      ========================================= */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-test-modal-title"
        >
          <div className="relative w-full max-w-[460px] overflow-hidden rounded-[25px] border border-slate-200 bg-white shadow-[0_30px_90px_-30px_rgba(15,23,42,0.45)]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                  {editingTest ? (
                    <Edit2 className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h2
                    id="global-test-modal-title"
                    className="text-base font-bold text-slate-950"
                  >
                    {editingTest
                      ? "Edit Global Test"
                      : "Create Global Test"}
                  </h2>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    {editingTest
                      ? "Update the test information and visibility."
                      : "Create a test that diagnostic centers can add to their catalog."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                aria-label="Close modal"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:opacity-40
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(
                onSubmit,
              )}
              className="space-y-4 px-6 pb-6"
            >
              {/* Test Name */}
              <div>
                <label
                  htmlFor="test-name"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600"
                >
                  Test Name
                </label>

                <input
                  id="test-name"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Complete Blood Count"
                  {...register("name", {
                    required:
                      "Test name is required.",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Test name is required.",
                    maxLength: {
                      value: 150,
                      message:
                        "Test name is too long.",
                    },
                  })}
                  className={`
                    h-11
                    w-full
                    rounded-xl
                    border
                    bg-white
                    px-3
                    text-xs
                    font-medium
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:ring-4
                    ${
                      errors.name
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
                    }
                  `}
                />

                {errors.name && (
                  <p className="mt-1.5 text-[10px] font-medium text-rose-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="test-description"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600"
                >
                  Description
                  <span className="ml-1 font-normal normal-case tracking-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="test-description"
                  rows={4}
                  placeholder="Add a short description about this diagnostic test..."
                  {...register(
                    "description",
                    {
                      maxLength: {
                        value: 500,
                        message:
                          "Description cannot exceed 500 characters.",
                      },
                    },
                  )}
                  className={`
                    w-full
                    resize-none
                    rounded-xl
                    border
                    bg-white
                    px-3
                    py-3
                    text-xs
                    leading-5
                    text-slate-900
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:ring-4
                    ${
                      errors.description
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10"
                    }
                  `}
                />

                {errors.description && (
                  <p className="mt-1.5 text-[10px] font-medium text-rose-600">
                    {
                      errors.description
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <label
                htmlFor="test-active"
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  px-3.5
                  py-3
                  transition
                  hover:border-slate-300
                  hover:bg-slate-50
                "
              >
                <input
                  id="test-active"
                  type="checkbox"
                  {...register(
                    "isActive",
                  )}
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600 focus:ring-blue-500"
                />

                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800">
                    Active test
                  </span>

                  <span className="mt-0.5 block text-[10px] leading-4 text-slate-400">
                    Active tests can be selected
                    by diagnostic centers.
                  </span>
                </span>
              </label>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="
                    h-10
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    text-xs
                    font-bold
                    text-slate-600
                    transition
                    hover:border-slate-300
                    hover:bg-slate-50
                    hover:text-slate-900
                    disabled:opacity-40
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="
                    inline-flex
                    h-10
                    min-w-[125px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-950
                    px-4
                    text-xs
                    font-bold
                    text-white
                    shadow-[0_8px_20px_-10px_rgba(15,23,42,0.7)]
                    transition
                    hover:bg-slate-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : editingTest ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Update Test
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Create Test
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
