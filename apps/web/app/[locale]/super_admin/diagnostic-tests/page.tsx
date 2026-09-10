"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Loader2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { 
  useGlobalTests, 
  useAdminAddGlobalTest, 
  useAdminUpdateGlobalTest, 
  useAdminDeleteGlobalTest,
  DiagnosticTest 
} from "@/lib/hooks/useDiagnosticCenter";

interface TestFormValues {
  name: string;
  description: string;
  isActive: boolean;
}
// diagnostic-tests
export default function AdminGlobalTestsPage() {
  const { data: tests = [], isLoading } = useGlobalTests();
  const addMutation = useAdminAddGlobalTest();
  const updateMutation = useAdminUpdateGlobalTest();
  const deleteMutation = useAdminDeleteGlobalTest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<DiagnosticTest | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestFormValues>();

  const openAddModal = () => {
    setEditingTest(null);
    reset({ name: "", description: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (test: DiagnosticTest) => {
    setEditingTest(test);
    reset({ name: test.name, description: test.description || "", isActive: test.isActive });
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
        await updateMutation.mutateAsync({ id: editingTest.id, payload: data });
        toast.success("Test updated successfully!");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Test added successfully!");
      }
      closeModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save test");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will remove the test globally.")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Test deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete test");
      }
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Diagnostic Tests</h1>
          <p className="text-sm text-slate-500">Manage tests that diagnostic centers can add to their profile.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Test
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 font-medium">Test Name</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{test.name}</td>
                <td className="px-6 py-4 text-slate-500">{test.description || "N/A"}</td>
                <td className="px-6 py-4">
                  {test.isActive ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Active</span>
                  ) : (
                    <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(test)} className="mr-3 p-2 text-slate-400 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(test.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex justify-between">
              <h3 className="text-lg font-bold">{editingTest ? "Edit Test" : "Add Global Test"}</h3>
              <button onClick={closeModal}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Test Name</label>
                <input {...register("name", { required: true })} className="w-full rounded-lg border p-2.5 text-sm dark:bg-slate-800" placeholder="e.g. Complete Blood Count" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea {...register("description")} className="w-full rounded-lg border p-2.5 text-sm dark:bg-slate-800" rows={3} placeholder="Optional details..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded" />
                <label className="text-sm font-medium">Active (Visible to Labs)</label>
              </div>
              <button type="submit" className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                {editingTest ? "Update Test" : "Save Test"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}