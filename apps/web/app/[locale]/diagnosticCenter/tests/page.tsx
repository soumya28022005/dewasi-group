"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Loader2, AlertCircle, Search, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGlobalTests,
  useCenterTests,
  useAddCenterTest,
  useUpdateCenterTest,
  useRemoveCenterTest,
  DiagnosticTest,
  CenterTest
} from "@/lib/hooks/useDiagnosticCenter";

interface TestFormValues {
  testId: string;
  price: number;
  isAvailable: boolean;
}

export default function CenterTestsPage() {
  const t = useTranslations("DiagnosticCenter");
  
  const { data: globalTests = [], isLoading: isLoadingGlobal } = useGlobalTests();
  const { data: centerTests = [], isLoading: isLoadingCenter } = useCenterTests();
  
  const addTestMutation = useAddCenterTest();
  const updateTestMutation = useUpdateCenterTest();
  const removeTestMutation = useRemoveCenterTest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<CenterTest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestFormValues>();

  // যেসব টেস্ট ল্যাব এখনো অ্যাড করেনি, সেগুলো বের করা
  const availableGlobalTests = globalTests.filter(
    (gt) => !centerTests.some((ct) => ct.testId === gt.id)
  );

  const filteredCenterTests = centerTests.filter((ct) =>
    ct.diagnosticTest?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingTest(null);
    reset({ testId: "", price: 0, isAvailable: true });
    setIsModalOpen(true);
  };

  const openEditModal = (test: CenterTest) => {
    setEditingTest(test);
    reset({ testId: test.testId, price: test.price, isAvailable: test.isAvailable });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTest(null);
    reset();
  };

  const onSubmit = async (data: TestFormValues) => {
    try {
      if (editingTest) {
        await updateTestMutation.mutateAsync({
          testId: editingTest.id,
          payload: { price: Number(data.price), isAvailable: data.isAvailable },
        });
        toast.success("Test updated successfully!");
      } else {
        await addTestMutation.mutateAsync({
          testId: data.testId,
          price: Number(data.price),
          isAvailable: data.isAvailable,
        });
        toast.success("Test added successfully!");
      }
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async (testId: string) => {
    if (confirm("Are you sure you want to remove this test?")) {
      try {
        await removeTestMutation.mutateAsync(testId);
        toast.success("Test removed successfully!");
      } catch (error) {
        toast.error("Failed to remove test");
      }
    }
  };

  if (isLoadingGlobal || isLoadingCenter) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("manageTests")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add and manage your diagnostic center's test catalog and pricing.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {t("addTest")}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search your tests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Test List Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {filteredCenterTests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <AlertCircle className="mb-2 h-8 w-8 text-slate-400" />
            <p>No tests found. Click "Add New Test" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-3 font-medium">Test Name</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCenterTests.map((ct) => (
                  <tr key={ct.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {ct.diagnosticTest?.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      ৳ {ct.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {ct.isAvailable ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <Check className="h-3 w-3" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                          <X className="h-3 w-3" /> Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ct)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ct.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingTest ? "Update Test" : t("addTest")}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Select Test (Only for Add) */}
              {!editingTest && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Select Test
                  </label>
                  <select
                    {...register("testId", { required: "Please select a test" })}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="">-- Choose a global test --</option>
                    {availableGlobalTests.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {errors.testId && <p className="mt-1 text-xs text-rose-500">{errors.testId.message}</p>}
                </div>
              )}

              {/* Readonly Test Name (For Edit) */}
              {editingTest && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Test Name
                  </label>
                  <input
                    type="text"
                    value={editingTest.diagnosticTest?.name}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50"
                  />
                </div>
              )}

              {/* Price */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("testPrice")} (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500"
                  {...register("price", { required: "Price is required", min: 0 })}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price.message}</p>}
              </div>

              {/* Is Available */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  {...register("isAvailable")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Currently Available
                </label>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addTestMutation.isPending || updateTestMutation.isPending}
                  className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {(addTestMutation.isPending || updateTestMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingTest ? "Update" : "Add Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}