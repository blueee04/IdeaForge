"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { dashboardService } from "@/services/dashboardService";
import type { Idea } from "@/types";
import { IconArrowLeft, IconBookmark, IconTrash, IconExternalLink } from "@/components/Icons";

export default function IdeaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdea = async () => {
      try {
        const ideas = await dashboardService.getSavedIdeas();
        const found = ideas.find((i) => i.id === params.id);
        setIdea(found || null);
      } catch (err) {
        console.error("Failed to load idea:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadIdea();
  }, [params.id]);

  const handleDelete = async () => {
    if (!idea) return;
    
    if (confirm("Are you sure you want to delete this idea?")) {
      try {
        await dashboardService.removeIdea(idea.id);
        router.push("/dashboard/seeker");
      } catch (err) {
        alert("Failed to delete idea");
      }
    }
  };

  const handleArchive = async () => {
    if (!idea) return;
    // TODO: Implement archive functionality when backend supports it
    alert("Archive feature coming soon!");
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo">Le Sage</a>
          </div>
        </header>
        <div className="dashboard-content" style={{ textAlign: "center", padding: "80px 20px" }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="dashboard-layout">
        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo">Le Sage</a>
          </div>
        </header>
        <div className="dashboard-content" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Idea not found</h2>
          <button 
            className="btn-primary" 
            onClick={() => router.push("/dashboard/seeker")}
            style={{ marginTop: "24px" }}
          >
            <IconArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">Le Sage</a>
          <nav className="nav-links">
            <a href="/dashboard/seeker" className="nav-link">Dashboard</a>
            <a href="/generate" className="nav-link">Generate Ideas</a>
            <a href="#" className="nav-link">Saved Ideas</a>
            <a href="#" className="nav-link">Experts</a>
          </nav>
          <div className="nav-actions">
            <button className="btn-text" onClick={() => router.push("/")}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Back button */}
        <button 
          className="btn-text" 
          onClick={() => router.back()}
          style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <IconArrowLeft size={16} /> Back
        </button>

        {/* Idea header */}
        <div style={{ background: "var(--bg-card)", borderRadius: "16px", padding: "32px", border: "1px solid var(--border-color)", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>{idea.title}</h1>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span className="score-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                  Novelty: {idea.noveltyScore}%
                </span>
                <span className="score-badge" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
                  Feasibility: {idea.feasibility || idea.feasibilityScore}
                </span>
                <span className="score-badge" style={{ background: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}>
                  {idea.field}
                </span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
              <button 
                className="btn-secondary" 
                onClick={handleArchive}
                style={{ padding: "8px 16px", fontSize: "0.875rem" }}
              >
                <IconBookmark size={16} /> Archive
              </button>
              <button 
                className="btn-text" 
                onClick={handleDelete}
                style={{ padding: "8px 16px", fontSize: "0.875rem", color: "#ef4444" }}
              >
                <IconTrash size={16} /> Delete
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "8px", color: "var(--text-secondary)" }}>Market Potential</h3>
            <p style={{ fontSize: "1.125rem", marginBottom: "24px" }}>{idea.marketPotential || "High"}</p>
            
            <h3 style={{ fontSize: "1rem", marginBottom: "8px", color: "var(--text-secondary)" }}>Description</h3>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.8 }}>{idea.description}</p>
          </div>
        </div>

        {/* Research citations */}
        {idea.researchCitations && idea.researchCitations.length > 0 && (
          <div style={{ background: "var(--bg-card)", borderRadius: "16px", padding: "32px", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }}>Research Citations</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {idea.researchCitations.map((citation, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: "16px", 
                    background: "rgba(255, 255, 255, 0.02)", 
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <a 
                    href={citation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      color: "var(--primary-color)",
                      textDecoration: "none"
                    }}
                  >
                    <IconExternalLink size={16} />
                    <span style={{ fontSize: "0.9375rem", wordBreak: "break-all" }}>{citation}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
