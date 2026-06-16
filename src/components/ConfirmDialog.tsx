"use client";

import { useAppStore } from "@/stores/site-store";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog() {
  const { isConfirmOpen, deletingSite, closeConfirm } = useAppStore();

  if (!isConfirmOpen || !deletingSite) return null;

  const handleDelete = async () => {
    await fetch(`/api/sites/${deletingSite.id}`, { method: "DELETE" });
    closeConfirm();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closeConfirm}>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">确认删除</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          确定要删除「{deletingSite.name}」吗？此操作不可撤销。
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeConfirm} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">取消</button>
          <button onClick={handleDelete} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">确认删除</button>
        </div>
      </div>
    </div>
  );
}
