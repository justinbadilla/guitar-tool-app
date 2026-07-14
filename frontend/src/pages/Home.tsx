import "./Home.css";
import Header from "../components/layouts/Headers";
import FloatingNotes from "../components/layouts/FloatingNotes";
import { Link } from "react-router-dom";
import { Rows4, ListMusic, Guitar, FolderPen, FolderOpen } from "lucide-react";

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
            <FloatingNotes />
            <Header>
                <button className="header-buttons"> about </button>
                {isLoggedIn ? (
                    <button className="header-buttons" onClick={onLogout}>log out</button>
                ) : (
                    <button className="header-buttons" onClick={onOpenLogin}>login</button>
                )}
            </Header>

            <div className="home-content">
                <h1 className="home-heading">
                    WELCOME TO GUITAR APP</h1>

                <div className="home-links">
                    <Link to="/songwriting" className="home-card">
                        <span className="card-icon">
                            <FolderPen className="icon-default" />
                            <FolderOpen className="icon-hover" />
                        </span>
                        <span>Create Song Project</span>
                    </Link>

                    <Link to="/chords" className="home-card">
                        <span className="card-icon">
                            <Rows4 className="icon-default" />
                            <ListMusic className="icon-hover" />
                        </span>
                        <span>Interactive Fretboard</span>
                    </Link>

                    <div className="home-card">
                        <Guitar size={48} color="black" />
                        <span>Guitar Practice</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;