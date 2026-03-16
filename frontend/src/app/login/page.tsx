"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IconMail, IconLock, IconArrowRight } from "@/components/Icons";
import { onboardingService } from "@/services/onboardingService";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSignup = searchParams.get("signup") === "true";
  const [mode, setMode] = useState<"login" | "signup">(isSignup ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // HOOK: Replace with Supabase Auth in Phase 3
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // or supabase.auth.signUp({ email, password, options: { data: { name } } });
    await new Promise((r) => setTimeout(r, 800));

    // Determine dashboard route based on user role
    if (!onboardingService.hasCompletedOnboarding()) {
      router.push("/onboarding");
      return;
    }

    const prefs = onboardingService.getPreferences();
    const role = prefs?.role || "seeker";

    if (role === "mentor") {
      router.push("/dashboard/mentor");
    } else {
      router.push("/dashboard/seeker");
    }
  };

  const handleOAuth = async (provider: string) => {
    // HOOK: Replace with Supabase OAuth in Phase 3
    // await supabase.auth.signInWithOAuth({ provider });
    console.log(`OAuth: ${provider}`);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (!onboardingService.hasCompletedOnboarding()) {
      router.push("/onboarding");
      return;
    }

    const prefs = onboardingService.getPreferences();
    const role = prefs?.role || "seeker";

    if (role === "mentor") {
      router.push("/dashboard/mentor");
    } else {
      router.push("/dashboard/seeker");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <a href="/" className="logo">Le Sage</a>
            <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p>
              {mode === "login"
                ? "Sign in to continue to your dashboard"
                : "Get started with research backed startup ideas"}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* OAuth buttons */}
            <button type="button" className="btn-oauth" onClick={() => handleOAuth("google")}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <button type="button" className="btn-oauth" onClick={() => handleOAuth("github")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            {/* Name field (signup only) */}
            {mode === "signup" && (
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "0.9375rem", marginTop: "8px" }}
              disabled={loading}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              {!loading && <IconArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-footer">
            {mode === "login" ? (
              <p>
                Do not have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); }}>
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }}>
                  Sign in
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-container"><div className="auth-card" style={{ textAlign: "center", padding: "80px 40px" }}>Loading...</div></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
