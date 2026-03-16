"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onboardingService } from "@/services/onboardingService";
import { mockExperts } from "@/mocks/experts";
import { mockIdeas } from "@/mocks/ideas";
import {
  IconCompass, IconUsers, IconMessage, IconBookOpen,
  IconChart, IconTrending, IconArrowRight,
} from "@/components/Icons";
import type { Expert, Idea } from "@/types";
import { dashboardService } from "@/services/dashboardService";

export default function MentorDashboard() {
  const router = useRouter();
  const [mentorName, setMentorName] = useState("Mentor");
  const [seekerIdeas, setSeekerIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth + role, redirect if wrong role
    const prefs = onboardingService.getPreferences();
    if (prefs && prefs.role === "seeker") {
      router.push("/dashboard/seeker");
      return;
    }

    const fetchIdeas = async () => {
      try {
        const savedIdeas = await dashboardService.getSavedIdeas();
        setSeekerIdeas(savedIdeas.length > 0 ? savedIdeas : mockIdeas.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch ideas for mentor review:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeas();
  }, [router]);

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">Le Sage</a>
          <nav className="nav-links">
            <a href="/dashboard/mentor" className="nav-link" style={{ color: "var(--text-primary)", fontWeight: 500 }}>Dashboard</a>
            <a href="#" className="nav-link">Review Ideas</a>
            <a href="#" className="nav-link">My Seekers</a>
            <a href="#" className="nav-link">Messages</a>
          </nav>
          <div className="nav-actions">
            {/* HOOK: Wire to Supabase Auth signOut */}
            <button className="btn-text" onClick={() => router.push("/")}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-greeting">
          <h1>Welcome back, {mentorName}</h1>
          <p>Here is what needs your expertise today.</p>
        </div>

        {/* Quick stats */}
        <div className="dashboard-grid">
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon"><IconCompass size={20} /></div>
              <h3>Active Mentorships</h3>
            </div>
            <p>Idea seekers you are currently guiding through their research journey.</p>
            <div className="dash-stat">3</div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon"><IconMessage size={20} /></div>
              <h3>Pending Reviews</h3>
            </div>
            <p>Ideas awaiting your expert feedback and validation.</p>
            <div className="dash-stat">7</div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-icon"><IconChart size={20} /></div>
              <h3>Your Impact</h3>
            </div>
            <p>Ideas refined and validated with your guidance this month.</p>
            <div className="dash-stat">12</div>
          </div>
        </div>

        {/* Ideas to review */}
        <div className="dash-section-title">
          <IconBookOpen size={18} /> Ideas Awaiting Your Expertise
        </div>
        <div className="idea-list">
          {seekerIdeas.slice(0, 4).map((idea) => (
            <div key={idea.id} className="idea-item">
              <div style={{ flex: 1 }}>
                <h4>{idea.title}</h4>
                <p>{idea.description.slice(0, 120)}...</p>
                <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="score-badge">N: {idea.noveltyScore}%</span>
                  <span className="score-badge">F: {idea.feasibility || idea.feasibilityScore}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{idea.citations?.length || idea.researchCitations?.length || 0} citations</span>
                </div>
              </div>
              <div>
                <span
                  className="btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "6px 14px", cursor: "pointer" }}
                  onClick={() => console.log("HOOK: Navigate to idea review", idea.id)}
                >
                  Review <IconArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Your expertise areas */}
        <div className="dash-section-title" style={{ marginTop: "40px" }}>
          <IconTrending size={18} /> Your Expertise Areas
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {(onboardingService.getPreferences()?.fields || ["healthtech", "aiml"]).map((field) => (
            <span key={field} className="score-badge" style={{ fontSize: "0.8125rem", padding: "8px 16px" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </span>
          ))}
        </div>

        {/* Recent mentees */}
        <div className="dash-section-title">
          <IconUsers size={18} /> Recent Seekers
        </div>
        <div className="mentor-list">
          <div className="mentor-card">
            <div className="mentor-avatar">AK</div>
            <h4>Alex Kowalski</h4>
            <div className="mentor-meta">Exploring HealthTech ideas</div>
            <div className="mentor-bio">Working on an AI drug interaction checker for polypharmacy patients. Needs validation on the regulatory pathway.</div>
          </div>
          <div className="mentor-card">
            <div className="mentor-avatar">RP</div>
            <h4>Riya Patel</h4>
            <div className="mentor-meta">Exploring ClimateTech ideas</div>
            <div className="mentor-bio">Building a satellite based carbon credit verification system. Looking for guidance on ML model selection.</div>
          </div>
          <div className="mentor-card">
            <div className="mentor-avatar">JL</div>
            <h4>James Lee</h4>
            <div className="mentor-meta">Exploring EdTech ideas</div>
            <div className="mentor-bio">Developing an adaptive microlearning engine. Needs help with spaced repetition algorithm design.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
