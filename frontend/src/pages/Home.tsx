import "./Home.css";
import Header from "../components/layouts/Headers";
import FloatingNotes from "../components/layouts/FloatingNotes";
import { Link } from "react-router-dom";
import { Rows4, ListMusic, Guitar, FolderPen, FolderOpen } from "lucide-react";
import Footer from "../components/layouts/Footer";
import fretboardScreenshot from "../assets/fretboard-screenshot.png";
import songwritingScreenshot from "../assets/songwriting-screenshot.png";

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
            <div className="home-hero">
                <FloatingNotes />
                <Header>
                    <a href="#about" className="header-buttons">about</a>
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
                            <span>Practice (coming soon)</span>
                        </div>
                    </div>
                </div>
            </div>

            <section id="about" className="about-section">
                <h2>About</h2>
                <p>
                    A guitar songwriting tool built to help you explore chords,
                    tunings, and song ideas — all in one place.
                </p>
                <div className="about-features">
                    <div className="about-feature">
                        <h3>Interactive Fretboard</h3>
                        <p>
                            Click frets directly on a live fretboard to build any chord shape
                            and see it identified in real time. Filled with features to help
                            guitarists - interval breakdowns, alternate tunings, and an AI assistant that explains
                            the theory behind what you're playing. Save your favorite shapes
                            to a personal, filterable chord library you can pull from anywhere
                            in the app.
                        </p>
                        <img
                            src={fretboardScreenshot}
                            alt="Interactive fretboard with chord detection"
                            className="about-screenshot"
                        />
                    </div>

                    <div className="about-feature">
                        <h3>Songwriting Workspace</h3>
                        <p>
                            Organize full songs section by section — verses, choruses,
                            bridges, with their own chord progressions, lyrics, and
                            pedal chains. Drag to reorder anything, from entire sections
                            down to individual chords, and pull chords straight from your
                            saved library or build them on the spot.
                        </p>
                        <img
                            src={songwritingScreenshot}
                            alt="Songwriting workspace with sections and chord progressions"
                            className="about-screenshot"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;