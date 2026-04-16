import React, { useMemo, useState } from "react";
import { Grid2X2, List, Plus, Trash2 } from "lucide-react";
import { useApp } from "../state/AppState";
import styles from "./workouts.module.css";
import { v4 as uuidv4 } from "uuid";

function WorkoutCard({ workout, onDelete }) {
  const tone = workout.type === "Strength" ? "badgePrimary" : workout.type === "Cardio" ? "badgeSecondary" : "badgeAccent";
  return (
    <div className={`card ${styles.workout}`}>
      <div className="cardBody">
        <div className={styles.workoutTop}>
          <div className={styles.workoutTitle}>{workout.name}</div>
          <button className="btn btnDanger" onClick={onDelete} title="Delete workout">
            <Trash2 size={16} /> Delete
          </button>
        </div>
        <div className={styles.meta}>
          <span className={`badge ${tone}`}>{workout.type}</span>
          <span className="badge">{workout.intensity}</span>
          <span className="badge">{workout.durationMin} min</span>
        </div>
        <div className={styles.tags}>
          {workout.tags.map((t) => (
            <span key={t} className={styles.tag}>#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkoutRow({ workout, onDelete }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowTitle}>{workout.name}</div>
      <div className={styles.rowMeta}>
        <span className="badge">{workout.type}</span>
        <span className="badge">{workout.intensity}</span>
        <span className="badge">{workout.durationMin} min</span>
      </div>
      <button className="btn btnDanger" onClick={onDelete} title="Delete workout">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function WorkoutsPage() {
  const { state, dispatch } = useApp();
  const [newName, setNewName] = useState("");

  const filtered = useMemo(() => {
    const q = state.workouts.query.trim().toLowerCase();
    return state.workouts.items.filter((w) => {
      const matchesQuery =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q));
      const matchesType = state.workouts.filters.type === "All" || w.type === state.workouts.filters.type;
      const matchesIntensity = state.workouts.filters.intensity === "All" || w.intensity === state.workouts.filters.intensity;
      return matchesQuery && matchesType && matchesIntensity;
    });
  }, [state.workouts.items, state.workouts.query, state.workouts.filters]);

  return (
    <div className={styles.page}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">Workouts</h2>
            <p className="p">Grid/list views with search and filters.</p>
          </div>

          <div className={styles.toolbar}>
            <button
              className={state.workouts.view === "grid" ? "btn btnPrimary" : "btn"}
              onClick={() => dispatch({ type: "workouts/setView", view: "grid" })}
              title="Grid"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              className={state.workouts.view === "list" ? "btn btnPrimary" : "btn"}
              onClick={() => dispatch({ type: "workouts/setView", view: "list" })}
              title="List"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="cardBody">
          <div className={styles.filters}>
            <div className={styles.filter}>
              <label className={styles.label}>Type</label>
              <select
                className="input"
                value={state.workouts.filters.type}
                onChange={(e) => dispatch({ type: "workouts/setFilters", patch: { type: e.target.value } })}
              >
                <option>All</option>
                <option>Strength</option>
                <option>Cardio</option>
                <option>Mobility</option>
              </select>
            </div>
            <div className={styles.filter}>
              <label className={styles.label}>Intensity</label>
              <select
                className="input"
                value={state.workouts.filters.intensity}
                onChange={(e) => dispatch({ type: "workouts/setFilters", patch: { intensity: e.target.value } })}
              >
                <option>All</option>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>

            <div className={styles.create}>
              <label className={styles.label}>Create</label>
              <div className={styles.createRow}>
                <input
                  className="input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New workout name"
                />
                <button
                  className="btn btnPrimary"
                  onClick={() => {
                    const name = newName.trim();
                    if (!name) return;
                    dispatch({
                      type: "workouts/add",
                      workout: {
                        id: uuidv4(),
                        name,
                        type: "Strength",
                        intensity: "Moderate",
                        durationMin: 40,
                        tags: ["custom"]
                      }
                    });
                    setNewName("");
                  }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resultsHeader}>
            <div className="p">
              Showing <strong>{filtered.length}</strong> of <strong>{state.workouts.items.length}</strong>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>No workouts match your current filters/search.</div>
          ) : state.workouts.view === "grid" ? (
            <div className="grid3">
              {filtered.map((w) => (
                <WorkoutCard key={w.id} workout={w} onDelete={() => dispatch({ type: "workouts/delete", id: w.id })} />
              ))}
            </div>
          ) : (
            <div className={styles.table}>
              {filtered.map((w) => (
                <WorkoutRow key={w.id} workout={w} onDelete={() => dispatch({ type: "workouts/delete", id: w.id })} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
