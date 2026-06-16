"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/site-store";
import { useCategories } from "@/hooks/use-sites";
import { X } from "lucide-react";

export default function SiteForm() {
  const { isFormOpen, editingSite, closeForm } = useAppStore();
  const { categories, mutate: mutateCats } = useCategories();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingSite) {
      setName(editingSite.name);
      setUrl(editingSite.url);
      setDescription(editingSite.description || "");
      setCategoryId(editingSite.categoryId);
      setTags(editingSite.tags?.map((t) => t.name) || []);
    } else {
      setName("");
      setUrl("");
      setDescription("");
      setCategoryId(categories[0]?.id || "");
      setTags([]);
    }
  }, [editingSite, categories]);

  if (!isFormOpen) return null;

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (i: number) => setTags(tags.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !categoryId) return;
    setSaving(true);

    const body = { name, url, description: description || null, categoryId, tags };

    try {
      if (editingSite) {
        await fetch(`/api/sites/${editingSite.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/sites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      closeForm();
      window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closeForm}>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {editingSite ? "编辑站点" : "新增站点"}
          </h2>
          <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">站点名称 *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：GitHub"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">站点地址 *</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">所属分类 *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" required>
              <option value="">请选择分类</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">站点描述</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简要描述（可选）" rows={2}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">标签</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="输入标签后回车" className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
              <button type="button" onClick={addTag} className="rounded-lg bg-slate-100 px-3 text-sm text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">添加</button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {t}
                    <button type="button" onClick={() => removeTag(i)} className="text-indigo-400 hover:text-indigo-600">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">取消</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50">{saving ? "保存中..." : "确认"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
