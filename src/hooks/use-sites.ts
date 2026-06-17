import useSWR from "swr";
import type { Site, Category } from "@/lib/types";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSites(category?: string, search?: string) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (debouncedSearch) params.set("search", debouncedSearch);

  const qs = params.toString();
  const url = `/api/sites${qs ? `?${qs}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<Site[]>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return { sites: data || [], error, isLoading, mutate };
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/categories",
    fetcher,
    { revalidateOnFocus: false }
  );

  return { categories: data || [], error, isLoading, mutate };
}