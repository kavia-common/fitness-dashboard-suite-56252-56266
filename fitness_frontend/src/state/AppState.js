import React, { createContext, useContext, useMemo, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * @typedef {Object} Workout
 * @property {string} id
 * @property {string} name
 * @property {"Strength"|"Cardio"|"Mobility"} type
 * @property {"Easy"|"Moderate"|"Hard"} intensity
 * @property {number} durationMin
 * @property {string[]} tags
 */

const AppContext = createContext(null);

const LS_KEY = "fitness_dashboard_state_v1";

function nowIso() {
  return new Date().toISOString();
}

function seedWorkouts() {
  return [
    {
      id: uuidv4(),
      name: "Full Body Strength",
      type: "Strength",
      intensity: "Moderate",
      durationMin: 45,
      tags: ["dumbbells", "compound", "balanced"]
    },
    {
      id: uuidv4(),
      name: "Zone 2 Ride",
      type: "Cardio",
      intensity: "Easy",
      durationMin: 60,
      tags: ["endurance", "bike"]
    },
    {
      id: uuidv4(),
      name: "Mobility Reset",
      type: "Mobility",
      intensity: "Easy",
      durationMin: 20,
      tags: ["recovery", "hips", "shoulders"]
    }
  ];
}

function seedNotifications() {
  return [
    {
      id: uuidv4(),
      title: "Welcome to your dashboard",
      body: "Complete onboarding to personalize your plan.",
      kind: "info",
      createdAt: nowIso(),
      read: false
    },
    {
      id: uuidv4(),
      title: "Scheduler tip",
      body: "Drag workouts onto the calendar to plan your week.",
      kind: "tip",
      createdAt: nowIso(),
      read: false
    }
  ];
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const initialState = loadState() || {
  user: {
    name: "Alex",
    email: "alex@example.com",
    goal: "Build strength and consistency",
    isAdmin: true
  },
  onboarding: {
    completed: false,
    step: 1
  },
  workouts: {
    items: seedWorkouts(),
    view: "grid",
    query: "",
    filters: {
      type: "All",
      intensity: "All"
    }
  },
  scheduler: {
    events: []
  },
  notifications: {
    items: seedNotifications()
  },
  admin: {
    users: [
      { id: uuidv4(), name: "Alex", email: "alex@example.com", role: "Admin", status: "Active" },
      { id: uuidv4(), name: "Sam", email: "sam@example.com", role: "Coach", status: "Active" },
      { id: uuidv4(), name: "Jamie", email: "jamie@example.com", role: "Member", status: "Invited" }
    ],
    content: [
      { id: uuidv4(), title: "Beginner Strength Plan", status: "Published", updatedAt: nowIso() },
      { id: uuidv4(), title: "5K Prep (4 weeks)", status: "Draft", updatedAt: nowIso() }
    ]
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "onboarding/complete": {
      const next = { ...state, onboarding: { completed: true, step: 3 } };
      persistState(next);
      return next;
    }
    case "onboarding/setStep": {
      const next = { ...state, onboarding: { ...state.onboarding, step: action.step } };
      persistState(next);
      return next;
    }
    case "user/update": {
      const next = { ...state, user: { ...state.user, ...action.patch } };
      persistState(next);
      return next;
    }
    case "workouts/setView": {
      const next = { ...state, workouts: { ...state.workouts, view: action.view } };
      persistState(next);
      return next;
    }
    case "workouts/setQuery": {
      const next = { ...state, workouts: { ...state.workouts, query: action.query } };
      persistState(next);
      return next;
    }
    case "workouts/setFilters": {
      const next = { ...state, workouts: { ...state.workouts, filters: { ...state.workouts.filters, ...action.patch } } };
      persistState(next);
      return next;
    }
    case "workouts/add": {
      const next = { ...state, workouts: { ...state.workouts, items: [action.workout, ...state.workouts.items] } };
      persistState(next);
      return next;
    }
    case "workouts/delete": {
      const next = {
        ...state,
        workouts: { ...state.workouts, items: state.workouts.items.filter((w) => w.id !== action.id) }
      };
      persistState(next);
      return next;
    }
    case "scheduler/setEvents": {
      const next = { ...state, scheduler: { ...state.scheduler, events: action.events } };
      persistState(next);
      return next;
    }
    case "notifications/markRead": {
      const next = {
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.items.map((n) => (n.id === action.id ? { ...n, read: true } : n))
        }
      };
      persistState(next);
      return next;
    }
    case "notifications/markAllRead": {
      const next = {
        ...state,
        notifications: {
          ...state.notifications,
          items: state.notifications.items.map((n) => ({ ...n, read: true }))
        }
      };
      persistState(next);
      return next;
    }
    case "notifications/add": {
      const next = {
        ...state,
        notifications: {
          ...state.notifications,
          items: [action.notification, ...state.notifications.items]
        }
      };
      persistState(next);
      return next;
    }
    case "admin/updateUserRole": {
      const next = {
        ...state,
        admin: {
          ...state.admin,
          users: state.admin.users.map((u) => (u.id === action.id ? { ...u, role: action.role } : u))
        }
      };
      persistState(next);
      return next;
    }
    case "admin/inviteUser": {
      const next = {
        ...state,
        admin: {
          ...state.admin,
          users: [{ id: uuidv4(), name: action.name, email: action.email, role: action.role, status: "Invited" }, ...state.admin.users]
        }
      };
      persistState(next);
      return next;
    }
    case "admin/addContent": {
      const next = {
        ...state,
        admin: {
          ...state.admin,
          content: [{ id: uuidv4(), title: action.title, status: "Draft", updatedAt: nowIso() }, ...state.admin.content]
        }
      };
      persistState(next);
      return next;
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function AppProvider({ children }) {
  /** Provides global UI/app state (local-first) for onboarding, profile, workouts, scheduler, notifications and admin sections. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApp() {
  /** Hook to access AppProvider state and dispatch. */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
