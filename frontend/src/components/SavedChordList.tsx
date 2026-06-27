import { useState, useEffect } from "react";
import ChordDiagram from "./ChordDiagram";
import { fetchSavedChords } from "../api/savedChords";
import type { StringState } from "../hooks/useFretboardState";
import type { SavedChord } from "../api/savedChords";

interface SavedChordListProps {
    savedChords: SavedChord[];
    onSelectChord: (positions: StringState[]) => void;
}

function SavedChordList({ savedChords, onSelectChord }: SavedChordListProps) {

    return (
        <div className="saved-chord-list">
            {savedChords.map((chord) => (
                <button
                    key={chord.id}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(chord.positions)}
                >
                    <ChordDiagram positions={chord.positions} name={chord.name} tuning={chord.tuning} />
                </button>
            ))}
        </div>
    );
}

export default SavedChordList;