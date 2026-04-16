import axios from "axios";

/**
 * IMPORTANT: The backend interface spec is not present in this repo yet.
 * This client is intentionally generic; wire endpoints once fitness_backend OpenAPI is available.
 */
const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
const apiBase = process.env.REACT_APP_API_BASE || "/api";

export const http = axios.create({
  baseURL: backendUrl ? `${backendUrl}${apiBase}` : apiBase,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// PUBLIC_INTERFACE
export async function healthcheck() {
  /** Calls a health endpoint (path configurable via REACT_APP_HEALTHCHECK_PATH) if available on the backend. */
  const path = process.env.REACT_APP_HEALTHCHECK_PATH || "/health";
  const res = await http.get(path);
  return res.data;
}
