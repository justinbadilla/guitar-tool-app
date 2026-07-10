import "./AuthModal.css";
import { useState } from "react";
import { registerUser, loginUser, saveToken } from "../../api/auth";

interface AuthModalProps {
    onClose: () => void;
    onLoginSuccess: () => void; // called after a successful login/register
}

/**
 * AuthModal
 *
 * Centered popup for logging in or registering, with clickable tab between two options. 
 * On success, saves the JWT with saveToken() and notifies the parent with onLoginSuccess so it
 * can update app-wide logged-in state. Rendered at the App level so it can be triggered from anywhere in the app.
 */
function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        setError("");

        if (username.trim() === "" || password.trim() === "") {
            setError("Username and password are required.");
            return;
        }

        setIsSubmitting(true);

        try {
            if (mode === "login") {
                const token = await loginUser(username, password);
                saveToken(token);
                onLoginSuccess();
            } else {
                await registerUser(username, password);
                // After successful registration, log them in immediately
                const token = await loginUser(username, password);
                saveToken(token);
                onLoginSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-modal">
            <div className="auth-modal-tabs">
                <button
                    className={mode === "login" ? "active" : ""}
                    onClick={() => { setMode("login"); setError(""); }}
                >
                    Login
                </button>
                <button
                    className={mode === "register" ? "active" : ""}
                    onClick={() => { setMode("register"); setError(""); }}
                >
                    Register
                </button>
            </div>

            <div className="auth-modal-field">
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="auth-modal-field">
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                />
            </div>

            {error && <p className="auth-modal-error">{error}</p>}

            <div className="auth-modal-actions">
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default AuthModal;