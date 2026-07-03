import "./ChordPickerModal.css";
import Fretboard from "../fretboard/Fretboard";
import SavedChordList from "./SavedChordList";
import PresetChordList from "./PresetChordList";
import ChordFilterBar from "./ChordFilterBar";
import TuningSelector from "../tuning/TuningSelector";
import { useState } from "react";
import { STANDARD_TUNING } from "../../music/notes";
import { useFretboardState } from "../../hooks/useFretboardState";
import { chordMatchesFilters } from "../../music/chordFilters";
import { getNotesFromStringStates, detectChordName, getRootNote } from "../../music/chords";
import type { SavedChord } from "../../api/savedChords";
import type { ChordFilters } from "../../music/chordFilters";

interface ChordPickerModalProps {
    savedChords: SavedChord[]; // passed in from the parent (not fetched here)
    onSelectChord: (chord: SavedChord) => void; // called when user picks any chord (saved, preset, or built)
    onClose: () => void;
}

// ChordPickerModal

// Tabbed modal for selecting a chord to add to a song section's chord progression. 
// Three tabs: "Saved Chords", "Presets", and "Build Chord"
// All three tabs produce a SavedChord-shaped object handed back with onSelectChord.
// Used for songwriting.tsx (chord progression box)
 
function ChordPickerModal({ savedChords, onSelectChord, onClose }: ChordPickerModalProps) {

    // Tab state
    const [activeTab, setActiveTab] = useState<"saved" | "presets" | "build">("saved");

    // Build tab (live fretboard state)
    const { stringStates, handleFretClick, handleToggle, fretMarkers } = useFretboardState(6);
    const [tuning, setTuning] = useState<string[]>(STANDARD_TUNING);

    // chord info from whatever is currently fretted on the build tab
    const notes = getNotesFromStringStates(stringStates, tuning);
    const chordName = detectChordName(notes);
    const rootNote = getRootNote(stringStates, tuning, chordName);

    // Saved tab (filter state)
    const [filters, setFilters] = useState<ChordFilters>({
        tuning: null,
        quality: null,
        rootNote: null,
    });


    // used to populate the tuning filter dropdown options
    const availableTunings = Array.from(
        new Set(savedChords.map((c) => JSON.stringify(c.tuning)))
    ).map((t) => JSON.parse(t));

    // Saved chords narrowed by whichever filters are currently active.
    const filteredSavedChords = savedChords.filter((chord) => chordMatchesFilters(chord, filters));

    /**
     * Packages the build tab's current fretboard state into a
     * SavedChord-shaped object and passes it to onSelectChord.
     */
    function handleUseBuiltChord() {
        onSelectChord({
            id: crypto.randomUUID(), //UUID since its not saved to database yet (frontend's id)
            name: chordName,
            positions: stringStates,
            tuning: tuning,
        });
    }

    return (
        <div className="chord-picker-modal">

            {/* Tab navigation + close button */}
            <div className="chord-picker-tabs">
                <button onClick={() => setActiveTab("saved")}>Saved Chords</button>
                <button onClick={() => setActiveTab("presets")}>Presets</button>
                <button onClick={() => setActiveTab("build")}>Build Chord</button>
                <button onClick={onClose}>Close</button>
            </div>

            {/* Saved chords tab (filterable list) */}
            {activeTab === "saved" && (
                <>
                    <ChordFilterBar
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableTunings={availableTunings}
                    />
                    <SavedChordList
                        savedChords={filteredSavedChords}
                        onSelectChord={onSelectChord}
                    />
                </>
            )}

            {/* Presets tab (hardcoded chord library) */}
            {activeTab === "presets" && (
                <PresetChordList onSelectChord={onSelectChord} />
            )}

            {/* Build tab (live mini fretboard) */}
            {activeTab === "build" && (
                <div className="chord-picker-build">
                    <p>{chordName}</p>
                    <TuningSelector
                        activeTuning={tuning}
                        onSelectTuning={setTuning}
                    />
                    <Fretboard
                        stringStates={stringStates}
                        handleFretClick={handleFretClick}
                        handleToggle={handleToggle}
                        fretMarkers={fretMarkers}
                        rootNote={rootNote}
                        tuning={tuning}
                        fretRange={{ start: 1, end: 15 }}
                    />
                    <button onClick={handleUseBuiltChord}>Add This Chord</button>
                </div>
            )}
        </div>
    );
}

export default ChordPickerModal;