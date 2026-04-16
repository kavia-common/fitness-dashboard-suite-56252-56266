import React from "react";
import { healthcheck } from "../api/client";
import styles from "./apihelp.module.css";

export default function ApiDocsHelpPage() {
  return (
    <div className={styles.page}>
      <div className="card">
        <div className="cardHeader">
          <div>
            <h2 className="h2">API help</h2>
            <p className="p">How this frontend expects to connect to fitness_backend.</p>
          </div>
          <span className="badge badgePrimary">Env-driven</span>
        </div>
        <div className="cardBody">
          <div className={styles.block}>
            <div className={styles.title}>Environment variables</div>
            <ul className={styles.ul}>
              <li><code>REACT_APP_BACKEND_URL</code>: backend origin (e.g. <code>http://localhost:8000</code>)</li>
              <li><code>REACT_APP_API_BASE</code>: API base path (default <code>/api</code>)</li>
              <li><code>REACT_APP_WS_URL</code>: websocket URL (if backend supports real-time)</li>
              <li><code>REACT_APP_HEALTHCHECK_PATH</code>: path for health check (default <code>/health</code>)</li>
            </ul>
          </div>

          <div className={styles.block}>
            <div className={styles.title}>Where to wire endpoints</div>
            <div className="p">
              Update <code>src/api/client.js</code> and create modules under <code>src/api/</code> (e.g. <code>workouts.js</code>, <code>profile.js</code>, <code>admin.js</code>)
              once <code>fitness_backend</code> exposes an OpenAPI spec or stable routes.
            </div>
          </div>

          <div className={styles.block}>
            <div className={styles.title}>Quick healthcheck</div>
            <div className="p">If your backend has a health endpoint, this will call it:</div>
            <button
              className="btn btnPrimary"
              onClick={async () => {
                try {
                  const data = await healthcheck();
                  alert(`Healthcheck OK: ${JSON.stringify(data)}`);
                } catch (e) {
                  alert("Healthcheck failed. Ensure REACT_APP_BACKEND_URL and REACT_APP_HEALTHCHECK_PATH are correct.");
                }
              }}
            >
              Run healthcheck
            </button>
          </div>

          <div className={styles.note}>
            The work item indicates a dependency on <code>fitness_backend</code>, but no OpenAPI spec was found in this repo yet.
            Once added, we should generate typed API bindings and replace localStorage state with backend persistence.
          </div>
        </div>
      </div>
    </div>
  );
}
