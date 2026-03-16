"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onboardingService } from "@/services/onboardingService";
import { mockIdeas } from "@/mocks/ideas";
import { mockExperts } from "@/mocks/experts";
import {
  IconSparkles, IconBookmark, IconTrending, IconPlus,
  IconResearch, IconUsers, IconArrowRight, IconChart,
} from "@/components/Icons";
import type { Idea } from "@/types";
import { expertService } from "@/services/expertService";
import { dashboardService } from "@/services/dashboardService";

export default function SeekerDashboard() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Explorer");

  useEffect(() => {
    // Check auth + role, redirect if wrong role
    const prefs = onboardingService.getPreferences();
    if (prefs && prefs.role === "mentor") {
      router.push("/dashboard/mentor");
      return;
    }

    const fetchData = async () => {
      try {
        const [savedIdeas, fetchedExperts] = await Promise.all([
          dashboardService.getSavedIdeas(),
          expertService.getExperts()
        ]);
        
        // Fallback to mock data if the DB is empty just to show UI structure
        setIdeas(savedIdeas.length > 0 ? savedIdeas : mockIdeas.slice(0, 1));
        setExperts(fetchedExperts.length > 0 ? fetchedExperts : mockExperts.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">Le Sage</a>
          <nav className="nav-links">
            <a href="/dashboard/seeker" className="nav-link" style={{ color: "var(--text-primary)", fontWeight: 500 }}>Dashboard</a>
            <a href="/generate" className="nav-link">Generate Ideas</a>
            <a href="#" className="nav-link">Saved Ideas</a>
            <a href="#" className="nav-link">Experts</a>
          </nav>
          <div className="nav-actions">
            {/* HOOK: Wire to Supabase Auth signOut */}
            <button className="btn-text" onClick={() => router.push("/")}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-greeting">
          <h1>Welcome back, {userName}</h1>
          <p>Here is what is happening with your startup research today.</p>
        </div>

        {/* Quick action cards */}
        <div className="dashboard-grid">
          <div className="dash-card" onClick={() => router.push("/generate")} style={{ cursor: "pointer" }}>
            <div className="dash-card-header">
              <div className="dash-card-icon"><IconSparkles size={20} /></div>
              <h3>Generate New Ideas</h3>
            </div>
            <p>Run the AI research engine to discover new startup ideas based on your interests.</p>
            <div style={{ marginTop: "16px" }}>
              <span className="btn-primary" style={{ fontSize: "0.8125rem", padding: "8px 16px" }}>
                Start Generating <IconArrowRight size={14} />
              </span>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon"><IconBookmark size={20} /></div>
              <h3>Saved Ideas</h3>
            </div>
            <p>Ideas you have saved for later review and deeper analysis.</p>
            <div className="dash-stat">{ideas.length}</div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon"><IconTrending size={20} /></div>
              <h3>Trending Fields</h3>
            </div>
            <p>Top fields with the most research activity and startup potential right now.</p>
            <div style={{ marginTop: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span className="score-badge">HealthTech</span>
              <span className="score-badge">ClimateTech</span>
              <span className="score-badge">AI/ML</span>
            </div>
          </div>
        </div>

        {/* Recent ideas */}
        <div className="dash-section-title">
          <IconResearch size={18} /> Recent Research Ideas
        </div>
        <div className="idea-list">
          {ideas.slice(0, 4).map((idea) => (
            <div key={idea.id} className="idea-item">
              <div style={{ flex: 1 }}>
                <h4>{idea.title}</h4>
                <p>{idea.description.slice(0, 120)}...</p>
              </div>
              <div className="idea-scores">
                <span className="score-badge">N: {idea.noveltyScore}%</span>
                <span className="score-badge">F: {idea.feasibility || idea.feasibilityScore}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended experts */}
        <div className="dash-section-title" style={{ marginTop: "40px" }}>
          <IconUsers size={18} /> Recommended Experts
        </div>
        <div className="mentor-list">
          {experts.slice(0, 3).map((expert) => (
            <div key={expert.id} className="mentor-card">
              <div className="mentor-avatar">{expert.name.split(" ").map((n: string) => n[0]).join("")}</div>
              <h4>{expert.name}</h4>
              <div className="mentor-meta">{expert.role} · Authority: {expert.domainAuthority}</div>
              <div className="mentor-bio">{expert.bio}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
