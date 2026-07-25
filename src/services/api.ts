import { siteConfig } from "@/config/site";

const API_BASE = siteConfig.apiUrl;

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  health: () => fetchAPI<{ status: string }>("/api/health"),

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  getLeakScore: (data: {
    subscriptions: unknown[];
    price_hikes?: unknown[];
    duplicates?: unknown[];
  }) =>
    fetchAPI("/api/analysis/leak-score", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getRecommendations: (data: {
    subscriptions: unknown[];
    usage?: unknown[];
  }) =>
    fetchAPI("/api/analysis/recommendations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  chatAdvisor: (message: string, context: Record<string, unknown> = {}) =>
    fetchAPI<{ response: string }>("/api/advisor/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    }),
};
