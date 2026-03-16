import { UserPreferences } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const onboardingService = {
  async savePreferences(prefs: UserPreferences): Promise<void> {
    // Keep local storage for synchronous reads during app boot
    if (typeof window !== "undefined") {
      localStorage.setItem("lesage_prefs", JSON.stringify(prefs));
    }

    // Also save to backend
    await fetch(`${API_BASE}/api/onboarding/preferences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
  },

  getPreferences(): UserPreferences | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("lesage_prefs");
    return stored ? JSON.parse(stored) : null;
  },

  hasCompletedOnboarding(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("lesage_prefs") !== null;
  },
};
