import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Dumbbell, TrendingUp, Bell } from "lucide-react";
import { useApp } from "../state/AppState";
import styles from "./dashboard.module.css";

function kpiCard({ title, value, hint, icon, tone }) {
  const toneClass = tone === "primary" ? "badgePrimary" : tone === "secondary" ? "badgeSecondary" : "badgeAccent";
  return (
    <div className={`card ${styles.kpi}`}>
      <div className="cardBody">
        <div className={styles.kpiTop}>
          <span className={`badge ${toneClass}`}>{icon} {title}</span>
        </div>
        <div className={styles.kpiValue}>{value}</div>
        <div className="p">{hint}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { state } = useApp();
  const unread = useMemo(() => state.notifications.items.filter((n) => !n.read).length, [state.notifications.items]);

  const workoutCount = state.workouts.items.length;
  const minutes = useMemo(() => state.workouts.items.reduce((sum, w) => sum + w.durationMin, 0), [state.workouts.items]);

  const upcoming = useMemo(() => {
    const sorted = [...state.scheduler.events].sort((a, b) => new Date(a.start) - new Date(b.start));
    return sorted.slice(0, 3);
  }, [state.scheduler.events]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className="h1">Welcome back, {state.user.name}.</h1>
          <p className="p">
            Your goal: <strong>{state.user.goal}</strong>. Plan the week, log workouts, and watch the trend lines.
          </p>
          <div className={styles.heroActions}>
            <Link to="/scheduler" className="btn btnPrimary"><CalendarClock size={16} /> Plan week</Link>
            <Link to="/workouts" className="btn btnGhost"><Dumbbell size={16} /> Browse workouts</Link>
            <Link to="/analytics" className="btn btnGhost"><TrendingUp size={16} /> View analytics</Link>
          </div>
        </div>
        <div className={`card ${styles.heroCard}`}>
          <div className="cardBody">
            <div className={styles.heroCardRow}>
              <span className="badge badgePrimary"><Bell size={14} /> Notifications</span>
              <span className="p">Unread: <strong>{unread}</strong></span>
            </div>
            <div className={styles.heroCardRow}>
              <span className="badge badgeSecondary"><Dumbbell size={14} /> Workouts</span>
              <span className="p">Library: <strong>{workoutCount}</strong> • Total mins: <strong>{minutes}</strong></span>
            </div>
            <div className={styles.heroCardRow}>
              <span className="badge badgeAccent"><CalendarClock size={14} /> Schedule</span>
              <span className="p">Upcoming: <strong>{upcoming.length}</strong></span>
            </div>
            <div className={styles.note}>
              This UI is local-first. Wire it to <code>fitness_backend</code> by updating <code>src/api/client.js</code> once the OpenAPI spec is available.
            </div>
          </div>
        </div>
      </section>

      <section className="grid3">
        {kpiCard({
          title: "Consistency",
          value: "72%",
          hint: "On track compared to last 4 weeks.",
          icon: <TrendingUp size={14} />,
          tone: "primary"
        })}
        {kpiCard({
          title: "Recovery",
          value: "Good",
          hint: "Mobility & easy cardio recommended today.",
          icon: <Dumbbell size={14} />,
          tone: "secondary"
        })}
        {kpiCard({
          title: "Focus",
          value: "Strength",
          hint: "2 sessions planned this week.",
          icon: <CalendarClock size={14} />,
          tone: "accent"
        })}
      </section>

      <section className={styles.split}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Upcoming schedule</h2>
              <p className="p">Your next planned sessions.</p>
            </div>
            <Link className="btn btnGhost" to="/scheduler">Open scheduler</Link>
          </div>
          <div className="cardBody">
            {upcoming.length === 0 ? (
              <div className={styles.empty}>No events yet. Add workouts from Scheduler.</div>
            ) : (
              <div className={styles.list}>
                {upcoming.map((e) => (
                  <div key={e.id} className={styles.row}>
                    <div className={styles.rowTitle}>{e.title}</div>
                    <div className={styles.rowMeta}>{new Date(e.start).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Next actions</h2>
              <p className="p">Complete onboarding or update your profile.</p>
            </div>
          </div>
          <div className="cardBody">
            <div className={styles.actions}>
              <Link to="/profile" className="btn btnPrimary">Update profile</Link>
              <Link to="/notifications" className="btn">Review notifications</Link>
              <Link to="/workouts" className="btn">Create a workout</Link>
            </div>
            <div className={styles.tip}>
              Pro tip: search workouts using <span className="kbd">/</span>.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
