import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useApp } from "../state/AppState";
import styles from "./scheduler.module.css";
import { v4 as uuidv4 } from "uuid";

/**
 * FullCalendar external drag support relies on DOM data attributes.
 * We keep it minimal here for a clean template.
 */
function WorkoutPaletteItem({ title }) {
  return (
    <div
      className={styles.paletteItem}
      draggable="true"
      data-event={JSON.stringify({ title })}
      aria-label={`Draggable workout ${title}`}
    >
      {title}
    </div>
  );
}

export default function SchedulerPage() {
  const { state, dispatch } = useApp();

  const events = useMemo(() => state.scheduler.events, [state.scheduler.events]);
  const palette = useMemo(() => state.workouts.items.slice(0, 6), [state.workouts.items]);

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Workout palette</h2>
              <p className="p">Drag items onto the calendar.</p>
            </div>
            <span className="badge badgeAccent">Drag & drop</span>
          </div>
          <div className="cardBody">
            <div className={styles.palette}>
              {palette.map((w) => (
                <WorkoutPaletteItem key={w.id} title={w.name} />
              ))}
            </div>
            <div className={styles.paletteNote}>
              Tip: create more workouts in the Workouts section to expand this list.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2 className="h2">Scheduler</h2>
              <p className="p">Plan sessions across your week.</p>
            </div>
            <button
              className="btn"
              onClick={() => dispatch({ type: "scheduler/setEvents", events: [] })}
              title="Clear events"
            >
              Clear
            </button>
          </div>
          <div className={`cardBody ${styles.calendarWrap}`}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              editable={true}
              droppable={true}
              eventReceive={(info) => {
                // When something is dropped from external source, persist it.
                const next = [
                  ...events,
                  {
                    id: uuidv4(),
                    title: info.event.title,
                    start: info.event.startStr,
                    allDay: info.event.allDay
                  }
                ];
                dispatch({ type: "scheduler/setEvents", events: next });
                info.event.remove(); // We re-render from state to avoid divergence.
              }}
              eventClick={(info) => {
                const id = info.event.id;
                const next = events.filter((e) => e.id !== id);
                dispatch({ type: "scheduler/setEvents", events: next });
              }}
              events={events}
              eventColor="#3B82F6"
              eventBorderColor="#2563EB"
              eventTextColor="#ffffff"
              dayMaxEvents={true}
            />
            <div className={styles.help}>
              Click an event to remove it. (In production you’d show a details modal.)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
