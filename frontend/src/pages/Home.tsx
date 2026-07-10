// pages/Home.tsx
import { Link } from "react-router-dom";
import "./Home.css";

interface HomeProps {
    onOpenLogin: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
}

/**
 * Home
 *
 * Landing page with navigation to the app's main features.
 * Rough placeholder layout
 */
function Home({ onOpenLogin, isLoggedIn, onLogout }: HomeProps) {
    return (
        <div className="home-page">
            <h1>Guitar Songwriting</h1>

            <div className="home-links">
                <Link to="/songwriting" className="home-card">
                    Songwriting
                </Link>

                <Link to="/chords" className="home-card">
                    Chord Analyzer
                </Link>

                <div className="home-card home-card-disabled">
                    Guitar Tools (coming soon)
                </div>

                {isLoggedIn ? (
                    <button className="home-card" onClick={onLogout}>
                        Log Out
                    </button>
                ) : (
                    <button className="home-card" onClick={onOpenLogin}>
                        Login
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;