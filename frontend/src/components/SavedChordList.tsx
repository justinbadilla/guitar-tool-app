import { useState, useEffect } from "react";
import ChordDiagram from "./ChordDiagram";
import { fetchSavedChords } from "../api/savedChords";
import type { StringState } from "../hooks/useFretboardState";

interface SavedChord {
    id: number;
    name: string;
    positions: StringState[];
}

interface SavedChordListProps {
    onSelectChord: (positions: StringState[]) => void;
}

function SavedChordList({ onSelectChord }: SavedChordListProps) {
    const [savedChords, setSavedChords] = useState<SavedChord[]>([]);

    useEffect(() => {
        fetchSavedChords().then((chords) => setSavedChords(chords));
    }, []);

    return (
        <div className="saved-chord-list">
            {savedChords.map((chord) => (
                <button
                    key={chord.id}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(chord.positions)}
                >
                    <ChordDiagram positions={chord.positions} name={chord.name} />
                </button>
            ))}
        </div>
    );
}

export default SavedChordList;