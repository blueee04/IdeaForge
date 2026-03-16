"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingService } from "@/services/onboardingService";
import { UserPreferences } from "@/types";
import { IconArrowRight } from "@/components/Icons";

const popularFields = ["HealthTech", "FinTech", "EdTech", "ClimateTech", "AI/ML", "SaaS", "E-commerce"];

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<"seeker" | "mentor">("seeker");
  const [field, setField] = useState("AI/ML");
  const [novelty, setNovelty] = useState(7);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const prefs: UserPreferences = {
        role,
        field, // backend schema expects this
        fields: [field], // kept for backwards compat with current UI tests if needed
        noveltyLevel: novelty,
        mode: role === "seeker" ? "ai" : "expert",
        goal: "Discover new startup ideas", // required by backend Pydantic schema
      };
      
      await onboardingService.savePreferences(prefs);
      
      if (role === "mentor") {
        router.push("/dashboard/mentor");
      } else {
        router.push("/dashboard/seeker");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences");
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: "600px" }}>
          <div className="auth-header">
            <a href="/" className="logo">Le Sage</a>
            <h1>Setup your profile</h1>
            <p>Tell us what you are looking for so we can tailor the AI agents to your goals.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>I am a...</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                <div 
                  onClick={() => setRole("seeker")}
                  style={{ 
                    padding: "16px", border: `2px solid ${role === "seeker" ? "var(--primary-color)" : "var(--border-color)"}`, 
                    borderRadius: "12px", cursor: "pointer", background: role === "seeker" ? "rgba(16, 185, 129, 0.05)" : "transparent"
                  }}>
                  <strong style={{ display: "block", marginBottom: "4px" }}>Idea Seeker</strong>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>I want AI to research and generate startup ideas.</span>
                </div>
                <div 
                  onClick={() => setRole("mentor")}
                  style={{ 
                    padding: "16px", border: `2px solid ${role === "mentor" ? "var(--primary-color)" : "var(--border-color)"}`, 
                    borderRadius: "12px", cursor: "pointer", background: role === "mentor" ? "rgba(16, 185, 129, 0.05)" : "transparent"
                  }}>
                  <strong style={{ display: "block", marginBottom: "4px" }}>Expert / Mentor</strong>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>I want to review ideas and validate them.</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Primary Field of Interest</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                {popularFields.map(f => (
                  <span 
                    key={f} 
                    onClick={() => setField(f)}
                    style={{ 
                      padding: "8px 16px", borderRadius: "100px", fontSize: "0.875rem", cursor: "pointer",
                      background: field === f ? "var(--primary-color)" : "var(--bg-card)",
                      color: field === f ? "white" : "var(--text-secondary)",
                      border: `1px solid ${field === f ? "var(--primary-color)" : "var(--border-color)"}`
                    }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Innovation Threshold
              </label>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px", marginBottom: "16px" }}>
                Higher novelty means riskier, more cutting-edge ideas. Lower means proven models in new niches.
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--text-tertiary)", width: "60px" }}>Safer</span>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={novelty} 
                  onChange={(e) => setNovelty(parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--primary-color)" }}
                />
                <span style={{ fontSize: "0.875rem", color: "var(--primary-color)", width: "60px", textAlign: "right", fontWeight: "bold" }}>Level {novelty}</span>
              </div>
            </div>

            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
                disabled={saving}
              >
                {saving ? "Saving Preferences..." : "Complete Setup"}
                {!saving && <IconArrowRight size={18} />}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
