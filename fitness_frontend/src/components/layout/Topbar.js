import React, { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import styles from "./topbar.module.css";
import { useApp } from "../../state/AppState";

function titleForPath(pathname) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/workouts")) return "Workouts";
  if (pathname.startsWith("/scheduler")) return "Scheduler";
  if (pathname.startsWith("/analytics")) return "Analytics";
  if (pathname.startsWith("/notifications")) return "Notifications";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/api-help")) return "API help";
  return "Fitness Dashboard";
}

export default function Topbar() {
  const { state, dispatch } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const searchRef = useRef(null);

  const unread = useMemo(
    () => state.notifications.items.filter((n) => !n.read).length,
    [state.notifications.items]
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "/" && loc.pathname !== "/workouts") {
        e.preventDefault();
        nav("/workouts");
        setTimeout(() => searchRef.current?.focus(), 30);
      } else if (e.key === "/" && loc.pathname === "/workouts") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loc.pathname, nav]);

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.title}>
          {titleForPath(loc.pathname)}
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.subtitle}>{state.user.goal}</span>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            ref={searchRef}
            className={`input ${styles.search}`}
            placeholder="Search workouts by name or tag… (press /)"
            value={state.workouts.query}
            onChange={(e) => dispatch({ type: "workouts/setQuery", query: e.target.value })}
            onFocus={() => {
              if (loc.pathname !== "/workouts") nav("/workouts");
            }}
            aria-label="Search workouts"
          />
        </div>
      </div>

      <div className={styles.right}>
        <span className={`badge ${styles.badge}`}>
          <Sparkles size={14} />
          <span>Streak: 3</span>
        </span>
        <span className={`badge ${unread ? "badgePrimary" : ""}`}>
          <span>Unread: {unread}</span>
        </span>
      </div>
    </header>
  );
}
