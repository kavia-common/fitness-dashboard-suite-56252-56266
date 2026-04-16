import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Dumbbell,
  Home,
  Bell,
  UserCircle2,
  Shield,
  Plus
} from "lucide-react";
import styles from "./sidebar.module.css";
import { useApp } from "../../state/AppState";
import { v4 as uuidv4 } from "uuid";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const nav = useNavigate();
  const { state, dispatch } = useApp();

  const unread = useMemo(
    () => state.notifications.items.filter((n) => !n.read).length,
    [state.notifications.items]
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">FD</div>
        <div>
          <div className={styles.brandTitle}>Fitness Dashboard</div>
          <div className={styles.brandSub}>Modern • Light • Fast</div>
        </div>
      </div>

      <div className={styles.quick}>
        <button
          className="btn btnPrimary"
          onClick={() => {
            const notification = {
              id: uuidv4(),
              title: "Workout added to your plan",
              body: "Nice — check Scheduler to place it on your calendar.",
              kind: "success",
              createdAt: new Date().toISOString(),
              read: false
            };
            dispatch({ type: "notifications/add", notification });
            nav("/notifications");
          }}
        >
          <Plus size={16} /> Quick add
        </button>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        <NavItem to="/" icon={Home} label="Dashboard" />
        <NavItem to="/workouts" icon={Dumbbell} label="Workouts" />
        <NavItem to="/scheduler" icon={CalendarDays} label="Scheduler" />
        <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
        <NavLink
          to="/notifications"
          className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
        >
          <Bell size={18} />
          <span>Notifications</span>
          {unread > 0 ? <span className={styles.pill}>{unread}</span> : null}
        </NavLink>
        <NavItem to="/profile" icon={UserCircle2} label="Profile" />
        <NavItem to="/api-help" icon={Shield} label="API help" />
        {state.user.isAdmin ? <NavItem to="/admin" icon={Shield} label="Admin" /> : null}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userBox}>
          <div className={styles.userAvatar} aria-hidden="true">{(state.user.name || "U")[0]}</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{state.user.name}</div>
            <div className={styles.userEmail}>{state.user.email}</div>
          </div>
        </div>
        <div className={styles.hint}>
          Tip: press <span className="kbd">/</span> to focus search on Workouts.
        </div>
      </div>
    </aside>
  );
}
