"use client";

import { useAppStore } from "@/stores/site-store";
import { useCategories } from "@/hooks/use-sites";
import { LayoutGrid } from "lucide-react";
import { useEffect } from "react";

const ICON_MAP: Record<string, React.ReactNode> = {
  code: <span>⌨</span>,
  "book-open": <span>📖</span>,
  server: <span>🖥</span>,
  activity: <span>📊</span>,
  "share-2": <span>🔗</span>,
  lock: <span>🔒</span>,
  folder: <span>📁</span>,
};

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory, setCategories } = useAppStore();
  const { categories } = useCategories();

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  return (
    <div className="sticky top-16 z-20 border-b border-slate-200 bg-white/60 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="no-scrollbar flex gap-1 overflow-x-auto py-3">
          {/* All */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-indigo-500 text-white dark:bg-indigo-500"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            全部
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-indigo-500 text-white dark:bg-indigo-500"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-xs">{ICON_MAP[cat.icon] || <span>📁</span>}</span>
              {cat.name}
              {cat._count && (
                <span className={`ml-0.5 text-xs ${selectedCategory === cat.id ? "text-indigo-200" : "text-slate-400"}`}>
                  {cat._count.sites}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
