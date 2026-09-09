export async function apiRequest(path: string, init: RequestInit = {}) {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(new URL(path, base).toString(), {
    ...init,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}
