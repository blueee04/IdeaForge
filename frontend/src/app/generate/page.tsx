"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onboardingService } from "@/services/onboardingService";
import { ideaService } from "@/services/ideaService";
import {
  IconSparkles,
  IconArrowRight,
} from "@/components/Icons";
import type { Idea } from "@/types";

export default function GenerateIdeasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load preferences
  const [field, setField] = useState("Technology");
  const [novelty, setNovelty] = useState(7);

  useEffect(() => {
    const prefs = onboardingService.getPreferences();
    if (prefs) {
      if (prefs.field) setField(prefs.field);
      else if (prefs.fields && prefs.fields.length > 0) setField(prefs.fields[0]);
      
      if (prefs.noveltyLevel) setNovelty(prefs.noveltyLevel);
    } else {
      // If no preferences, redirect to onboarding or login
      router.push("/login");
    }
  }, [router]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the real backend API
      const newIdeas = await ideaService.generateIdeas(field, novelty);
      setIdeas(newIdeas);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate ideas. The AI researchers might be asleep.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async (idea: Idea) => {
    try {
      await ideaService.saveIdea(idea);
      alert("Idea saved to dashboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to save idea.");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">Le Sage</a>
          <nav className="nav-links">
            <a href="/dashboard/seeker" className="nav-link">Dashboard</a>
            <a href="/generate" className="nav-link" style={{ color: "var(--text-primary)", fontWeight: 500 }}>Generate Ideas</a>
            <a href="#" className="nav-link">Saved Ideas</a>
            <a href="#" className="nav-link">Experts</a>
          </nav>
          <div className="nav-actions">
            <button className="btn-text" onClick={() => router.push("/")}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="dashboard-greeting" style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1>
            <span style={{ display: "inline-block", marginBottom: "-4px", marginRight: "8px" }}>
              <IconSparkles size={28} />
            </span>
            Generate New Startup Ideas
          </h1>
          <p>Our autonomous AI agents will research the latest trends in <strong>{field}</strong> and synthesize novel concepts.</p>
        </div>

        {!loading && ideas.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
            <h3 style={{ marginBottom: "16px" }}>Ready to explore?</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
              The AI will use your preference for a novelty score of {novelty}/10 to calibrate the ideas.
            </p>
            <button className="btn-primary" onClick={handleGenerate} style={{ padding: "14px 28px", fontSize: "1rem" }}>
              Start AI Research Sequence <IconArrowRight size={18} />
            </button>
            {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="loading-spinner" style={{ margin: "0 auto 24px", width: "40px", height: "40px", border: "3px solid var(--border-color)", borderTopColor: "var(--primary-color)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
            <h3>Agents researching...</h3>
            <p style={{ color: "var(--text-secondary)" }}>This usually takes 10-20 seconds as they read recent papers and analyze market gaps.</p>
            <style jsx>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        )}

        {ideas.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.25rem" }}>Found {ideas.length} ideas</h3>
              <button className="btn-secondary" onClick={handleGenerate} disabled={loading}>
                {loading ? "Regenerating..." : "Generate Again"}
              </button>
            </div>
            
            <div className="idea-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {ideas.map((idea, idx) => (
                <div key={idx} className="idea-item" style={{ display: "block", padding: "24px", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "1.125rem", margin: 0, paddingRight: "16px", lineHeight: 1.4 }}>{idea.title}</h4>
                    <div className="idea-scores" style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <span className="score-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>N: {idea.noveltyScore}%</span>
                      <span className="score-badge" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>F: {idea.feasibility || idea.feasibilityScore}</span>
                    </div>
                  </div>
                  
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>{idea.description}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
                      <strong>Market Potential:</strong> {idea.marketPotential || "High"}
                    </span>
                    <button className="btn-secondary" onClick={() => handleSaveIdea(idea)} style={{ fontSize: "0.875rem", padding: "6px 14px" }}>
                      Save Idea
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
