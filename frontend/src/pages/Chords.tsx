/**
 * Chords
 * The chord analyzer page:
 * Shows an interactive fretboard with live chord/interval
 * detection, alternate tuning support, a preset chord library, and a
 * filterable, persisted library of the user's saved chords.
 * This page owns the "source of truth" state that multiple child components
 * need to share (fretboard state, active tuning, saved chords)
 */

import Fretboard from '../components/fretboard/Fretboard';
import TuningSelector from '../components/tuning/TuningSelector';
import SavedChordList from '../components/chord-library/SavedChordList';
import ChordFilterBar from '../components/chord-library/ChordFilterBar';
import PresetChordList from '../components/chord-library/PresetChordList';
import ChordNameDisplay from '../components/chord-library/ChordNameDisplay';
import { useState, useEffect } from 'react';
import { useFretboardState } from '../hooks/useFretboardState';
import { saveChord, fetchSavedChords } from '../api/savedChords';
import { STANDARD_TUNING } from '../music/notes';
import { getNotesFromStringStates, detectChordName, getRootNote } from '../music/chords';
import { chordMatchesFilters } from '../music/chordFilters';
import type { SavedChord } from '../api/savedChords';
import type { StringState } from '../hooks/useFretboardState';
import type { ChordFilters } from '../music/chordFilters';

function Chords() {



    // ── State ──────────────────────────────────────────

    // Live fretboard state: which strings are open/muted/fretted + handlers and derived fretMarkers needed to render and interact with it.
    const { stringStates, handleFretClick, handleToggle, fretMarkers, loadPositions, clearFretboard } = useFretboardState(6);

    // Currently active tuning (defaults to standard and changes when user picks tuning, or loads a saved chord)
    const [activeTuning, setActiveTuning] = useState<string[]>(STANDARD_TUNING);

    // The user's saved chords (fetched once on page load)
    const [savedChords, setSavedChords] = useState<SavedChord[]>([]);
    useEffect(() => {
        fetchSavedChords().then((chords) => setSavedChords(chords));
    }, []);

    //Filters use state (for user's saved chord list)
    const [filters, setFilters] = useState<ChordFilters>({
        tuning: null,
        quality: null,
        rootNote: null,
    });



    // ── Derived values ─────────────────────────────────
    // Everything below is recalculated from state above on every render — none of it is stored separately

    // Notes/chord name/root currently shown on the live fretboard.
    const notes = getNotesFromStringStates(stringStates, activeTuning);
    const chordName = detectChordName(notes);
    const rootNote = getRootNote(stringStates, activeTuning, chordName);

    //Checks available tunings (from saved chords) for filters
    const availableTunings = Array.from(
        new Set(savedChords.map((c) => JSON.stringify(c.tuning)))
    ).map((t) => JSON.parse(t));

    // Saved chords narrowed down by whichever filters are currently active
    const filteredSavedChords = savedChords.filter((chord) => chordMatchesFilters(chord, filters));

    

    // ── Handlers ───────────────────────────────────────

    //loads chord from list onto the live fretboard. Updates both tuning and string/fret positions
    function loadChord(positions: StringState[], tuning: string[]) {
        setActiveTuning(tuning);
        loadPositions(positions);
    }

    //Save current fretboard state onto the savedChords list (so it shows immediately and doesnt need refetch)
    async function handleSaveClick() {
        const saved = await saveChord(chordName, stringStates, activeTuning);
        setSavedChords((prev) => [...prev, {
            id: saved.id,
            name: saved.name,
            positions: JSON.parse(saved.positionsJson),
            tuning: JSON.parse(saved.tuningJson),
        }]);
    }
    return (
        <div>
            <ChordNameDisplay chordName={chordName} />
            <Fretboard
                stringStates={stringStates}
                handleFretClick={handleFretClick}
                handleToggle={handleToggle}
                fretMarkers={fretMarkers}
                rootNote={rootNote}
                tuning={activeTuning}
            />
            <TuningSelector
                activeTuning={activeTuning}
                onSelectTuning={setActiveTuning}
            />
            <button onClick={handleSaveClick}>Save Chord</button>
            <button onClick={clearFretboard}>Clear</button>

            <PresetChordList onSelectChord={loadChord} />

            <ChordFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                availableTunings={availableTunings}
            />

            <SavedChordList savedChords={filteredSavedChords} onSelectChord={loadChord} />
        </div>
    );
}

export default Chords;