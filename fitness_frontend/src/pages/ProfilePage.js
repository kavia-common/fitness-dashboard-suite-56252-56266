import React, { useState } from "react";
import { useApp } from "../state/AppState";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { state, dispatch } = useApp();

  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [goal, setGoal] = useState(state.user.goal);

  return (
    <div className={styles.page}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Profile</h2>
            <p className="p">Manage your personal details and preferences.</p>
          </div>
          <span className="badge badgeSecondary">Local profile</span>
        </div>
        <div className="cardBody">
          <div className="grid2">
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: 12 }}>
            <label className={styles.label}>Goal</label>
            <input className="input" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>

          <div className={styles.actions}>
            <button
              className="btn btnPrimary"
              onClick={() => dispatch({ type: "user/update", patch: { name, email, goal } })}
            >
              Save changes
            </button>

            <button
              className="btn"
              onClick={() => dispatch({ type: "user/update", patch: { isAdmin: !state.user.isAdmin } })}
              title="For demo purposes"
            >
              Toggle admin: {state.user.isAdmin ? "ON" : "OFF"}
            </button>
          </div>

          <div className={styles.note}>
            Admin access controls the visibility of the Admin section. Replace this demo toggle with real RBAC from the backend.
          </div>
        </div>
      </div>
    </div>
  );
}
