import { API_BASE_URL } from "./config";

const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

/**
 * Registers new user. Throws with the backend's exact error message if registration fails
 * (AuthModal) catches this and displays it directly.
 */
export async function registerUser(username: string, password: string) {
    const response = await fetch(`${AUTH_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return response.text();
}

/**
 * Logs user in and returns the issued JWT. Throws with backend's error message on fail. Does NOT save the token. 
 */
export async function loginUser(username: string, password: string): Promise<string> {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    const data = await response.json();
    return data.token;
}


// Token storage (localStorage)
// In-memory-only state so the user stays logged in across page refreshes. 
// Centralized here so every other file reads/writes the token the same way (instead of each caller touching
// localStorage directly)

const TOKEN_KEY = "jwt_token";

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Quick check for "is there a token at all" 
 * (used by App.tsx on load to restore logged-in UI state without waiting on a network request)
 */
export function isLoggedIn(): boolean {
    return getToken() !== null;
}

/**
 * Builds Authorization header for protected requests. Returns empty object when logged out.
 *  ...getAuthHeader() adds nothing when there's no token, but adds Authorization header when there is.
 */
export function getAuthHeader(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}