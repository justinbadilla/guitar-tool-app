import "./Chords.css";
import Header from '../components/layouts/Headers';
import Fretboard from '../components/fretboard/Fretboard';
import TuningSelector from '../components/tuning/TuningSelector';
import ChordNameDisplay from '../components/chord-library/ChordNameDisplay';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useFretboardState } from '../hooks/useFretboardState';
import { saveChord, fetchSavedChords } from '../api/savedChords';
import { STANDARD_TUNING } from '../music/notes';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import type { SavedChord } from '../api/savedChords';
import ChordLibraryPanel from "../components/chord-library/ChordLibraryPanel";

interface ChordsProps {
    onRequireAuth: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
}

/**
 * Chords
 * 
 * The chord analyzer page:
 * Shows an interactive fretboard with live chord/interval
 * detection, alternate tuning support, a preset chord library, and a
 * filterable, persisted library of the user's saved chords.
 * This page owns the "source of truth" state that multiple child components
 * need to share (fretboard state, active tuning, saved chords)
 */
function Chords({ onRequireAuth, isLoggedIn, onLogout }: ChordsProps) {

    /** State */

    // Live fretboard state: which strings are open/muted/fretted + handlers and derived fretMarkers needed to render and interact with it.
    const { stringStates, handleFretClick, handleToggle, fretMarkers, loadPositions, clearFretboard } = useFretboardState(6);

    // Currently active tuning (defaults to standard and changes when user picks tuning, or loads a saved chord)
    const [activeTuning, setActiveTuning] = useState<string[]>(STANDARD_TUNING);

    // The user's saved chords (fetched once on page load)
    const [savedChords, setSavedChords] = useState<SavedChord[]>([]);
    useEffect(() => {
        fetchSavedChords().then((chords) => setSavedChords(chords));
    }, []);

    //** Derived Values */

    // Everything below is recalculated from state above on every render

    // Notes/chord name/root currently shown on the live fretboard.
    const notes = getNotesFromStringStates(stringStates, activeTuning);
    const chordName = detectChordName(notes);
    const rootNote = getRootNote(stringStates, activeTuning, chordName);

    /** Handlers */

    //loads chord from list onto the live fretboard. Updates both tuning and string/fret positions
    function loadChord(chord: SavedChord) {
        setActiveTuning(chord.tuning);
        loadPositions(chord.positions);
    }

    //Save current fretboard state onto the savedChords list (so it shows immediately and doesnt need refetch)
    async function handleSaveClick() {
        try {
            const saved = await saveChord(chordName, stringStates, activeTuning);
            setSavedChords((prev) => [...prev, {
                id: saved.id,
                name: saved.name,
                positions: JSON.parse(saved.positionsJson),
                tuning: JSON.parse(saved.tuningJson),
            }]);
        } catch {
            onRequireAuth();
        }
    }

    return (
        <div className="chords-page">
        <Header>
                <div className="header-nav-group">
                    <Link to="/" className="header-buttons">home</Link>
                    <Link to="/songwriting" className="header-buttons">create song project</Link>
                </div>
                {isLoggedIn ? (
                    <button className="header-buttons" onClick={onLogout}>log out</button>
                ) : (
                    <button className="header-buttons" onClick={onRequireAuth}>login</button>
                )}
            </Header>
        <div className="chords-container">

            

            <div className="chords-main-row">
                <div className="fretboard-box">
                    <div className="fretboard-box-top">
                        <ChordNameDisplay chordName={chordName} />
                        <TuningSelector
                            activeTuning={activeTuning}
                            onSelectTuning={setActiveTuning}
                        />
                    </div>

                    <Fretboard
                        stringStates={stringStates}
                        handleFretClick={handleFretClick}
                        handleToggle={handleToggle}
                        fretMarkers={fretMarkers}
                        rootNote={rootNote}
                        tuning={activeTuning}
                    />

                    <div className="fretboard-box-bottom">
                        <button onClick={clearFretboard}>Clear</button>
                        <button onClick={handleSaveClick}>Save Chord</button>
                    </div>
                </div>

                <div className="chat-placeholder">
                    <p>AI Chord Assistant (coming soon)</p>
                </div>
            </div>

            <ChordLibraryPanel savedChords={savedChords} onSelectChord={loadChord} />
        </div>
        </div>
    );
}

export default Chords