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

  uploadFile: async (file: File): Promise<{
    transactions_extracted: number;
    recurring_detected: number;
    message: string;
    mode?: "demo";
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.detail ?? "Upload failed");
    }
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

  chatAdvisor: async (message: string, context: Record<string, unknown> = {}) => {
    const res = await fetch("/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });
    if (!res.ok) throw new Error("Advisor is temporarily unavailable");
    return res.json() as Promise<{ response: string; model?: string }>;
  },
};
