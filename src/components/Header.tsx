"use client";

import { useAppStore } from "@/stores/site-store";
import { Moon, Sun, Plus, Search } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Header() {
  const { theme, toggleTheme, initTheme, openAddForm, searchQuery, setSearchQuery } =
    useAppStore();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
            <span className="text-sm font-bold">S</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Site Manager
          </h1>
        </div>

        {/* Search */}
        <div className="relative ml-auto max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="搜索站点... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-indigo-400 focus:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title={theme === "light" ? "切换暗色模式" : "切换亮色模式"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={openAddForm}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">新增站点</span>
          </button>
        </div>
      </div>
    </header>
  );
}
