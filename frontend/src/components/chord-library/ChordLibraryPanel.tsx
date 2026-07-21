import { useState } from "react";
import PresetChordList from "./PresetChordList";
import SavedChordList from "./SavedChordList";
import ChordFilterBar from "./ChordFilterBar";
import { chordMatchesFilters } from "../../music/chordFilters";
import type { ChordFilters } from "../../music/chordFilters";
import type { SavedChord } from "../../api/savedChords";
import "./ChordLibraryPanel.css"

interface ChordLibraryPanelProps {
    savedChords: SavedChord[];
    onSelectChord: (chord: SavedChord) => void;
    onChordDeleted: (id: number) => void;
}

/**
 * ChordLibraryPanel
 *
 * Tabbed container below the interactive fretboard: "Presets" (default) and "Saved Chords". 
 */
function ChordLibraryPanel({ savedChords, onSelectChord, onChordDeleted }: ChordLibraryPanelProps) {
    const [activeTab, setActiveTab] = useState<"presets" | "saved">("presets");

    const [filters, setFilters] = useState<ChordFilters>({
        tuning: null,
        quality: null,
        rootNote: null,
    });

    const availableTunings = Array.from(
        new Set(savedChords.map((c) => JSON.stringify(c.tuning)))
    ).map((t) => JSON.parse(t));

    const filteredSavedChords = savedChords.filter((chord) => chordMatchesFilters(chord, filters));

    return (
        <div className="chord-library-panel">
            <div className="chord-library-header">
                <div className="chord-library-tabs">
                    <button
                        className={activeTab === "presets" ? "active" : ""}
                        onClick={() => setActiveTab("presets")}
                    >
                        presets
                    </button>
                    <button
                        className={activeTab === "saved" ? "active" : ""}
                        onClick={() => setActiveTab("saved")}
                    >
                        saved
                    </button>
                </div>

                {activeTab === "saved" && (
                    <ChordFilterBar
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableTunings={availableTunings}
                    />
                )}
            </div>

            {activeTab === "presets" && (
                <PresetChordList onSelectChord={onSelectChord} />
            )}

            {activeTab === "saved" && (
                savedChords.length === 0 ? (
                    <p className="chord-library-empty">
                        Save chords to add them here
                    </p>
                ) : (
                    <SavedChordList
                        savedChords={filteredSavedChords}
                        onSelectChord={onSelectChord}
                        onChordDeleted={onChordDeleted}
                    />
                )
            )}
        </div>
    );
}

export default ChordLibraryPanel;