"use client";

import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import SiteGrid from "@/components/SiteGrid";
import SiteForm from "@/components/SiteForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useSites } from "@/hooks/use-sites";
import { useAppStore } from "@/stores/site-store";

export default function Home() {
  const { selectedCategory, searchQuery } = useAppStore();
  const { sites, isLoading } = useSites(
    selectedCategory !== "all" ? selectedCategory : undefined,
    searchQuery || undefined
  );

  return (
    <>
      <Header />
      <CategoryFilter />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <SiteGrid sites={sites} isLoading={isLoading} />
      </main>
      <SiteForm />
      <ConfirmDialog />
    </>
  );
}