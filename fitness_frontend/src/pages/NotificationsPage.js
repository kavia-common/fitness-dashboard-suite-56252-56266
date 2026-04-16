import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { useApp } from "../state/AppState";
import styles from "./notifications.module.css";

function kindBadge(kind) {
  if (kind === "success") return "badgeSecondary";
  if (kind === "tip") return "badgeAccent";
  if (kind === "error") return "badgeDanger";
  return "badgePrimary";
}

export default function NotificationsPage() {
  const { state, dispatch } = useApp();

  return (
    <div className={styles.page}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Notifications</h2>
            <p className="p">Reminders, scheduling tips, and system updates.</p>
          </div>
          <button className="btn" onClick={() => dispatch({ type: "notifications/markAllRead" })}>
            <CheckCheck size={16} /> Mark all read
          </button>
        </div>

        <div className="cardBody">
          {state.notifications.items.length === 0 ? (
            <div className={styles.empty}>No notifications.</div>
          ) : (
            <div className={styles.list}>
              {state.notifications.items.map((n) => (
                <div key={n.id} className={`${styles.item} ${n.read ? styles.read : ""}`}>
                  <div className={styles.itemTop}>
                    <div className={styles.title}>{n.title}</div>
                    <span className={`badge ${kindBadge(n.kind)}`}>{n.kind}</span>
                  </div>
                  <div className={styles.body}>{n.body}</div>
                  <div className={styles.meta}>
                    <span className="p">{new Date(n.createdAt).toLocaleString()}</span>
                    {!n.read ? (
                      <button className="btn btnPrimary" onClick={() => dispatch({ type: "notifications/markRead", id: n.id })}>
                        <Check size={16} /> Mark read
                      </button>
                    ) : (
                      <span className="badge">Read</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
