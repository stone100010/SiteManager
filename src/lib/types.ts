export type SiteStatus = "online" | "offline" | "unknown";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sites: number;
  };
}

export interface Site {
  id: string;
  name: string;
  url: string;
  description: string | null;
  iconUrl: string | null;
  categoryId: string;
  category?: Category;
  status: SiteStatus;
  sortOrder: number;
  clickCount: number;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface SiteFormData {
  name: string;
  url: string;
  description?: string;
  categoryId: string;
  tags?: string[];
}
