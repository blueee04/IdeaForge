"use client";

import { useState } from "react";
import { UserRole } from "@/types";
import { mockFields } from "@/mocks/fields";
import { onboardingService } from "@/services/onboardingService";
import { IconCompass, IconLightbulb } from "@/components/Icons";

interface RolePopupProps {
  onComplete: () => void;
}

export default function RolePopup({ onComplete }: RolePopupProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const toggleField = (id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2) {
      // HOOK: Save preferences via onboardingService
      onboardingService.savePreferences({
        role: selectedRole!,
        fields: selectedFields,
        noveltyLevel: 50,
        mode: "ai",
      });
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <h2>Welcome to Le Sage</h2>
            <p className="modal-subtitle">
              Let us personalize your experience. What best describes you?
            </p>

            <div className="role-options">
              <div
                className={`role-card ${selectedRole === "mentor" ? "selected" : ""}`}
                onClick={() => setSelectedRole("mentor")}
              >
                <div className="role-icon"><IconCompass size={36} /></div>
                <h3>Guide / Mentor</h3>
                <p>
                  I have domain expertise and want to help aspiring founders with research backed guidance
                </p>
              </div>

              <div
                className={`role-card ${selectedRole === "seeker" ? "selected" : ""}`}
                onClick={() => setSelectedRole("seeker")}
              >
                <div className="role-icon"><IconLightbulb size={36} /></div>
                <h3>Idea Seeker</h3>
                <p>
                  I am looking for validated startup ideas backed by real academic research and data
                </p>
              </div>
            </div>

            <button
              className="btn-primary modal-continue"
              disabled={!selectedRole}
              onClick={handleContinue}
              style={{ opacity: selectedRole ? 1 : 0.4 }}
            >
              Continue
            </button>
            <button className="modal-skip" onClick={handleSkip}>
              Skip for now
            </button>
          </>
        ) : (
          <>
            <h2>Pick your interests</h2>
            <p className="modal-subtitle">
              Select the fields you are most excited about. This helps our AI research engine focus on what matters to you.
            </p>

            <div className="field-chips">
              {mockFields.map((field) => (
                <button
                  key={field.id}
                  className={`field-chip ${selectedFields.includes(field.id) ? "selected" : ""}`}
                  onClick={() => toggleField(field.id)}
                >
                  {field.name}
                </button>
              ))}
            </div>

            <button
              className="btn-primary modal-continue"
              onClick={handleContinue}
            >
              {selectedFields.length > 0
                ? `Get Started (${selectedFields.length} selected)`
                : "Get Started"}
            </button>
            <button className="modal-skip" onClick={handleSkip}>
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
