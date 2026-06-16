"use client";

import { create } from "zustand";
import type { Site, Category } from "@/lib/types";

interface AppState {
  // Category filter
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Modal
  isFormOpen: boolean;
  editingSite: Site | null;
  openAddForm: () => void;
  openEditForm: (site: Site) => void;
  closeForm: () => void;

  // Confirm dialog
  isConfirmOpen: boolean;
  deletingSite: Site | null;
  openConfirm: (site: Site) => void;
  closeConfirm: () => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  initTheme: () => void;

  // Categories cache
  categories: Category[];
  setCategories: (cats: Category[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCategory: "all",
  setSelectedCategory: (id) => set({ selectedCategory: id }),

  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  isFormOpen: false,
  editingSite: null,
  openAddForm: () => set({ isFormOpen: true, editingSite: null }),
  openEditForm: (site) => set({ isFormOpen: true, editingSite: site }),
  closeForm: () => set({ isFormOpen: false, editingSite: null }),

  isConfirmOpen: false,
  deletingSite: null,
  openConfirm: (site) => set({ isConfirmOpen: true, deletingSite: site }),
  closeConfirm: () => set({ isConfirmOpen: false, deletingSite: null }),

  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark");
        localStorage.setItem("theme", next);
      }
      return { theme: next };
    }),
  initTheme: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },

  categories: [],
  setCategories: (cats) => set({ categories: cats }),
}));
