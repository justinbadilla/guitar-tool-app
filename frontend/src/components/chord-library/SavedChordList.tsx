/*
For rendering clickable diagrams 
Goes through all user saved chords
*/

import "./PresetChordList.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import type { StringState } from "../../hooks/useFretboardState";
import type { SavedChord } from "../../api/savedChords";

interface SavedChordListProps {
    savedChords: SavedChord[];
    onSelectChord: (positions: StringState[], tuning: string[]) => void;
}

function SavedChordList({ savedChords, onSelectChord }: SavedChordListProps) {

    return (
        <div className="saved-chord-list">
            {savedChords.map((chord) => (
                <button
                    key={chord.id}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(chord.positions, chord.tuning)}
                >
                    <ChordDiagram positions={chord.positions} name={chord.name} tuning={chord.tuning} />
                </button>
            ))}
        </div>
    );
}

export default SavedChordList;