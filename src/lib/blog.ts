// src/lib/Blog.ts

export type BlogItem = {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  body?: string;
  photo?: string;
  likes?: number;
  createdAt: string;
};

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() || "http://localhost:5000";

const FILE_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.trim() || "http://localhost:5000";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function buildUrl(baseUrl: string, path: string) {
  const safeBase = normalizeBaseUrl(baseUrl);
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return new URL(safePath, safeBase).toString();
}

export async function getAllBlogs(): Promise<BlogItem[]> {
  const url = buildUrl(API_BASE_URL, "/api/v1/blogs/list-publish");

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch blogs. Status: ${res.status}`);
  }

  const data = await res.json();
  return data?.blogs || [];
}

export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
  if (!slug) return null;
console.log("Fetching blog with slug:", slug);
  const url = buildUrl(
    API_BASE_URL,
    `/api/v1/blogs/${encodeURIComponent(slug)}`
  );

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data?.blog || null;
}

export function getBlogImageUrl(photo?: string) {
  if (!photo) return "/images/blog/default-blog.jpg";

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return buildUrl(FILE_BASE_URL, photo);
}