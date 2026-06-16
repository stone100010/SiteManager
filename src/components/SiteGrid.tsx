"use client";

import type { Site } from "@/lib/types";
import SiteCard from "./SiteCard";
import { FolderOpen } from "lucide-react";

interface SiteGridProps {
  sites: Site[];
  isLoading: boolean;
}

export default function SiteGrid({ sites, isLoading }: SiteGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
        <FolderOpen className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">暂无站点</p>
        <p className="mt-1 text-sm">点击右上角「新增站点」添加你的第一个网站</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
