import React, { useMemo, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useApp } from "../state/AppState";
import styles from "./admin.module.css";

export default function AdminPage() {
  const { state, dispatch } = useApp();
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [contentTitle, setContentTitle] = useState("");

  const activeCount = useMemo(() => state.admin.users.filter((u) => u.status === "Active").length, [state.admin.users]);

  return (
    <div className={styles.page}>
      <section className="grid3">
        <div className="card">
          <div className="cardBody">
            <div className="p">Users</div>
            <div className={styles.big}>{state.admin.users.length}</div>
            <span className="badge badgePrimary">Total</span>
          </div>
        </div>
        <div className="card">
          <div className="cardBody">
            <div className="p">Active users</div>
            <div className={styles.big}>{activeCount}</div>
            <span className="badge badgeSecondary">Active</span>
          </div>
        </div>
        <div className="card">
          <div className="cardBody">
            <div className="p">Programs</div>
            <div className={styles.big}>{state.admin.content.length}</div>
            <span className="badge badgeAccent">Content</span>
          </div>
        </div>
      </section>

      <section className={styles.split}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">User management</h2>
              <p className="p">Invite users and adjust roles.</p>
            </div>
          </div>
          <div className="cardBody">
            <div className={styles.inviteGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input className="input" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Full name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className="input" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@domain.com" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <select className="input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option>Member</option>
                  <option>Coach</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>&nbsp;</label>
                <button
                  className="btn btnPrimary"
                  onClick={() => {
                    if (!inviteName.trim() || !inviteEmail.includes("@")) return;
                    dispatch({ type: "admin/inviteUser", name: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole });
                    setInviteName("");
                    setInviteEmail("");
                    setInviteRole("Member");
                  }}
                >
                  <UserPlus size={16} /> Invite
                </button>
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Name</span><span>Email</span><span>Role</span><span>Status</span>
              </div>
              {state.admin.users.map((u) => (
                <div key={u.id} className={styles.tableRow}>
                  <span className={styles.bold}>{u.name}</span>
                  <span className={styles.muted}>{u.email}</span>
                  <span>
                    <select
                      className={`input ${styles.roleSelect}`}
                      value={u.role}
                      onChange={(e) => dispatch({ type: "admin/updateUserRole", id: u.id, role: e.target.value })}
                    >
                      <option>Member</option>
                      <option>Coach</option>
                      <option>Admin</option>
                    </select>
                  </span>
                  <span><span className="badge">{u.status}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Content management</h2>
              <p className="p">Programs, plans, and templates.</p>
            </div>
          </div>
          <div className="cardBody">
            <div className={styles.contentCreate}>
              <input className="input" value={contentTitle} onChange={(e) => setContentTitle(e.target.value)} placeholder="New program title" />
              <button
                className="btn btnPrimary"
                onClick={() => {
                  const t = contentTitle.trim();
                  if (!t) return;
                  dispatch({ type: "admin/addContent", title: t });
                  setContentTitle("");
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className={styles.contentList}>
              {state.admin.content.map((c) => (
                <div key={c.id} className={styles.contentRow}>
                  <div>
                    <div className={styles.bold}>{c.title}</div>
                    <div className={styles.muted}>Updated {new Date(c.updatedAt).toLocaleString()}</div>
                  </div>
                  <span className={`badge ${c.status === "Published" ? "badgeSecondary" : ""}`}>{c.status}</span>
                </div>
              ))}
            </div>

            <div className={styles.note}>
              Replace this demo data with real admin endpoints from <code>fitness_backend</code> when available.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
