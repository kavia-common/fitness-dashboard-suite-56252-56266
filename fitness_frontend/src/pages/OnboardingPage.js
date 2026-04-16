import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles, UserCircle2 } from "lucide-react";
import { useApp } from "../state/AppState";
import styles from "./onboarding.module.css";

function StepPill({ active, done, children }) {
  return (
    <div className={`${styles.stepPill} ${active ? styles.active : ""} ${done ? styles.done : ""}`}>
      {children}
    </div>
  );
}

export default function OnboardingPage() {
  const nav = useNavigate();
  const { state, dispatch } = useApp();
  const step = state.onboarding.step;

  const [name, setName] = useState(state.user.name || "");
  const [email, setEmail] = useState(state.user.email || "");
  const [goal, setGoal] = useState(state.user.goal || "");

  const canContinue = useMemo(() => {
    if (step === 1) return name.trim().length >= 2 && email.includes("@");
    if (step === 2) return goal.trim().length >= 6;
    return true;
  }, [step, name, email, goal]);

  return (
    <div className={styles.wrap}>
      <div className={`card ${styles.card}`}>
        <div className="cardHeader">
          <div>
            <h1 className="h1">Get started</h1>
            <p className="p">A quick onboarding to personalize your dashboard.</p>
          </div>
          <span className="badge badgePrimary"><Sparkles size={14} /> Light theme</span>
        </div>

        <div className="cardBody">
          <div className={styles.steps} aria-label="Onboarding steps">
            <StepPill active={step === 1} done={step > 1}>1. Basics</StepPill>
            <StepPill active={step === 2} done={step > 2}>2. Goals</StepPill>
            <StepPill active={step === 3} done={step > 3}>3. Finish</StepPill>
          </div>

          {step === 1 ? (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" />
              </div>

              <div className={styles.actions}>
                <button
                  className="btn btnPrimary"
                  disabled={!canContinue}
                  onClick={() => {
                    dispatch({ type: "user/update", patch: { name, email } });
                    dispatch({ type: "onboarding/setStep", step: 2 });
                  }}
                >
                  <UserCircle2 size={16} /> Continue
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Primary goal</label>
                <input className="input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Build strength and consistency" />
              </div>

              <div className={styles.actions}>
                <button className="btn" onClick={() => dispatch({ type: "onboarding/setStep", step: 1 })}>
                  Back
                </button>
                <button
                  className="btn btnPrimary"
                  disabled={!canContinue}
                  onClick={() => {
                    dispatch({ type: "user/update", patch: { goal } });
                    dispatch({ type: "onboarding/setStep", step: 3 });
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className={styles.finish}>
              <div className={styles.finishIcon}><CheckCircle2 size={28} /></div>
              <div>
                <div className={styles.finishTitle}>You're ready.</div>
                <div className="p">You can update this anytime in Profile.</div>
              </div>

              <div className={styles.actions}>
                <button
                  className="btn btnPrimary"
                  onClick={() => {
                    dispatch({ type: "onboarding/complete" });
                    nav("/");
                  }}
                >
                  Go to dashboard
                </button>
              </div>
            </div>
          ) : null}

          <div className={styles.footerNote}>
            Note: this template stores onboarding state in localStorage. Replace with backend auth/profile when available.
          </div>
        </div>
      </div>
    </div>
  );
}
