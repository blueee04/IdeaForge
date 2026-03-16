"use client";

import { useState, useEffect } from "react";
import RolePopup from "@/components/RolePopup";
import { onboardingService } from "@/services/onboardingService";
import {
  IconResearch, IconTarget, IconUsers, IconBrain,
  IconChart, IconMessage, IconDocument, IconBookOpen,
  IconArrowRight,
} from "@/components/Icons";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!onboardingService.hasCompletedOnboarding()) {
        setShowPopup(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">Le Sage</a>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#research" className="nav-link">Research</a>
            <a href="#experts" className="nav-link">Experts</a>
          </nav>
          <div className="nav-actions">
            <a href="/login" className="btn-text">Log in</a>
            <a href="/login?signup=true" className="btn-primary">Get Started Free</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1>Research backed startup ideas, validated by AI and real experts</h1>
        <p>
          Search academic papers, scan market trends, and generate startup ideas grounded in real research.
          Connect with domain experts who can help you build.
        </p>
        <div className="hero-actions">
          <a href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Get Le Sage Free
            <IconArrowRight size={18} />
          </a>
          <a href="#how-it-works" className="btn-secondary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            See how it works
          </a>
        </div>
        <p className="trust-text">Trusted by researchers, founders, and startup teams worldwide</p>
        <div className="trust-bar">
          <span className="trust-logo">Stanford</span>
          <span className="trust-logo">MIT</span>
          <span className="trust-logo">Y Combinator</span>
          <span className="trust-logo">Harvard</span>
          <span className="trust-logo">Techstars</span>
          <span className="trust-logo">Oxford</span>
        </div>
      </section>

      {/* Feature preview / Demo */}
      <section style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="demo-container">
          <div className="demo-content">
            <div className="demo-mock">
              {/* Library Panel */}
              <div className="demo-panel">
                <div className="demo-panel-header">Research Library</div>
                <div className="demo-list-item"><IconDocument size={14} /> AI Drug Interaction Analysis</div>
                <div className="demo-list-item"><IconDocument size={14} /> Federated Learning in Clinical Research</div>
                <div className="demo-list-item"><IconDocument size={14} /> Carbon Credit Verification Systems</div>
                <div className="demo-list-item"><IconDocument size={14} /> Adaptive Learning for Education</div>
                <div className="demo-list-item"><IconDocument size={14} /> Decentralized Identity for Finance</div>
              </div>

              {/* Main Panel */}
              <div className="demo-panel" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
                <div className="demo-panel-header">Generated Ideas</div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", padding: "4px 12px", background: "var(--bg-card)", borderRadius: "999px" }}>HealthTech</span>
                  <span style={{ fontSize: "0.75rem", padding: "4px 12px", background: "var(--bg-card)", borderRadius: "999px" }}>FinTech</span>
                  <span style={{ fontSize: "0.75rem", padding: "4px 12px", background: "var(--bg-card)", borderRadius: "999px" }}>ClimateTech</span>
                </div>
                <div className="demo-list-item" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  AI Powered Drug Interaction Checker
                </div>
                <div className="demo-list-item">
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Novelty: 87% · Feasibility: 74% · Confidence: 81%</span>
                </div>
                <div className="demo-list-item" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  Federated ML for Medical Research
                </div>
                <div className="demo-list-item">
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Novelty: 92% · Feasibility: 68% · Confidence: 78%</span>
                </div>
              </div>

              {/* Insight Panel */}
              <div>
                <div className="demo-highlight">
                  <h4>AI Powered Drug Interaction Checker</h4>
                  <p>
                    Uses NLP and knowledge graphs to analyze multi-drug interactions in real time,
                    reducing adverse events in polypharmacy patients.
                  </p>
                  <div style={{ marginTop: "12px", fontSize: "0.75rem", opacity: 0.7, display: "flex", alignItems: "center", gap: "4px" }}>
                    <IconBookOpen size={12} /> 2 research citations
                  </div>
                </div>
                <div className="demo-panel" style={{ marginTop: "12px" }}>
                  <div className="demo-panel-header">Expert Match</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Dr. Sarah Chen</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Stanford · h-index: 38</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-alt" id="features">
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <h2>Everything you need to find your next big idea</h2>
            <p>From deep research to expert connections, Le Sage handles the heavy lifting so you can focus on building.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><IconResearch size={22} /></div>
              <h3>Research Backed Ideas</h3>
              <p>
                Every startup idea is grounded in real academic papers, patents, and market data.
                No guesswork, just evidence.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><IconTarget size={22} /></div>
              <h3>Novelty Control</h3>
              <p>
                Set how innovative you want to be. From incremental improvements to moonshot breakthroughs,
                the AI calibrates accordingly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><IconUsers size={22} /></div>
              <h3>Expert Matchmaking</h3>
              <p>
                Get connected with verified domain specialists who have the research credentials
                and industry experience to help you succeed.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><IconBrain size={22} /></div>
              <h3>AI Research Engine</h3>
              <p>
                Multi-agent AI system that searches, analyzes, and synthesizes research from
                academic databases, patents, and the web.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><IconChart size={22} /></div>
              <h3>Feasibility Scoring</h3>
              <p>
                Each idea comes with novelty, feasibility, and confidence scores so you can
                make informed decisions quickly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><IconMessage size={22} /></div>
              <h3>Expert Chat</h3>
              <p>
                Built in messaging to collaborate with matched experts directly on the platform.
                No email chains needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works">
        <div className="section-header">
          <h2>From question to validated idea in minutes</h2>
          <p>A simple four step process powered by AI research agents working behind the scenes.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Choose Your Field</h3>
            <p>Select from HealthTech, FinTech, ClimateTech, EdTech, and more. Set your novelty threshold from incremental to breakthrough.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>AI Researches for You</h3>
            <p>Our multi-agent system scans academic papers, patent databases, and market trends to build a deep research context.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Get Validated Ideas</h3>
            <p>Receive startup ideas ranked by novelty, feasibility, and confidence, each backed by real citations and research data.</p>
          </div>
          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Connect with Experts</h3>
            <p>Match with domain specialists who can refine your idea, validate assumptions, and help you move to execution.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-alt">
        <div className="cta-section">
          <h2>Where research meets entrepreneurship</h2>
          <p>
            Stop guessing what to build. Let AI powered research and human expertise guide your next move.
            Get started for free today.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <a href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
              Get Started Free
            </a>
            <a href="#features" className="btn-secondary" style={{ padding: "14px 32px", fontSize: "1rem" }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="/" className="logo">Le Sage</a>
            <p>AI powered research automation for startup ideation and expert matchmaking.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#research">Research Engine</a>
            <a href="#experts">Experts</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API Reference</a>
            <a href="#">Blog</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">License</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>2026 Le Sage. All rights reserved.</span>
          <span>Built with open source tools</span>
        </div>
      </footer>

      {/* Role selection popup for new users */}
      {showPopup && <RolePopup onComplete={() => setShowPopup(false)} />}
    </>
  );
}
