"use client";

import type { Site } from "@/lib/types";
import { getFaviconUrl, timeAgo } from "@/lib/utils";
import { useAppStore } from "@/stores/site-store";
import { ExternalLink, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SiteCardProps {
  site: Site;
}

export default function SiteCard({ site }: SiteCardProps) {
  const { openEditForm, openConfirm } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusDot = {
    online: "bg-green-500",
    offline: "bg-red-500",
    unknown: "bg-slate-400 dark:bg-slate-500",
  }[site.status];

  const statusLabel = {
    online: "在线",
    offline: "离线",
    unknown: "未知",
  }[site.status];

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-slate-900/50">
      {/* Category color bar */}
      <div
        className="absolute right-0 top-0 h-1 w-12 rounded-bl-lg rounded-tr-xl"
        style={{ backgroundColor: site.category?.color || "#6366f1" }}
      />

      {/* Status dot + Menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${statusDot}`} title={statusLabel} />
          <span className="text-xs text-slate-400 dark:text-slate-500">{statusLabel}</span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
              <button
                onClick={() => { openEditForm(site); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Edit2 className="h-3.5 w-3.5" /> 编辑
              </button>
              <button
                onClick={() => { openConfirm(site); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> 删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Icon + Name */}
      <div className="mt-3 flex items-center gap-3">
        {site.iconUrl ? (
          <img src={site.iconUrl} alt="" className="h-8 w-8 rounded" />
        ) : (
          <img
            src={getFaviconUrl(site.url)}
            alt=""
            className="h-8 w-8 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "";
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {site.name}
          </h3>
          <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">
            {site.url}
          </p>
        </div>
      </div>

      {/* Description */}
      {site.description && (
        <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {site.description}
        </p>
      )}

      {/* Tags */}
      {site.tags && site.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {site.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
        <span>{timeAgo(site.lastCheckedAt)}</span>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {site.clickCount}
        </div>
      </div>

      {/* Click overlay */}
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fetch(`/api/sites/${site.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clickCount: site.clickCount + 1 }) })}
        className="absolute inset-0 rounded-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label={`打开 ${site.name}`}
      >
        <span className="sr-only flex items-center gap-1">
          <ExternalLink className="h-3 w-3" /> 打开
        </span>
      </a>
    </div>
  );
}
