import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { useApp } from "../state/AppState";
import styles from "./analytics.module.css";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

function buildTrend() {
  // 14-day synthetic trend for template purposes
  const out = [];
  const base = 40;
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({
      day: `${d.getMonth() + 1}/${d.getDate()}`,
      minutes: Math.max(10, Math.round(base + Math.sin(i / 2) * 10 + (13 - i) * 1.2))
    });
  }
  return out;
}

export default function AnalyticsPage() {
  const { state } = useApp();

  const trend = useMemo(() => buildTrend(), []);
  const byType = useMemo(() => {
    const m = new Map();
    state.workouts.items.forEach((w) => m.set(w.type, (m.get(w.type) || 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [state.workouts.items]);

  const totalWorkouts = state.workouts.items.length;
  const totalScheduled = state.scheduler.events.length;

  return (
    <div className={styles.page}>
      <section className="grid3">
        <div className="card">
          <div className="cardBody">
            <div className="p">Workouts in library</div>
            <div className={styles.bigNumber}>{totalWorkouts}</div>
            <span className="badge badgePrimary">Catalog</span>
          </div>
        </div>
        <div className="card">
          <div className="cardBody">
            <div className="p">Scheduled sessions</div>
            <div className={styles.bigNumber}>{totalScheduled}</div>
            <span className="badge badgeSecondary">Calendar</span>
          </div>
        </div>
        <div className="card">
          <div className="cardBody">
            <div className="p">Consistency score</div>
            <div className={styles.bigNumber}>72%</div>
            <span className="badge badgeAccent">Trend</span>
          </div>
        </div>
      </section>

      <section className={styles.charts}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Training minutes (14-day)</h2>
              <p className="p">Synthetic data; wire to backend when available.</p>
            </div>
          </div>
          <div className={`cardBody ${styles.chartBody}`}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trend} margin={{ left: 8, right: 18, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip />
                <Area type="monotone" dataKey="minutes" stroke="#2563EB" fill="url(#fillPrimary)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Workouts by type</h2>
              <p className="p">Distribution of your workout library.</p>
            </div>
          </div>
          <div className={`cardBody ${styles.chartBody}`}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" innerRadius={58} outerRadius={94} paddingAngle={3}>
                  {byType.map((entry, idx) => (
                    <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className={styles.legend}>
              {byType.map((d, idx) => (
                <div key={d.name} className={styles.legendRow}>
                  <span className={styles.swatch} style={{ background: COLORS[idx % COLORS.length] }} />
                  <span className={styles.legendName}>{d.name}</span>
                  <span className={styles.legendValue}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
