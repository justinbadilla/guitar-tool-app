import "./PresetChordList.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import type { SavedChord } from "../../api/savedChords";

interface SavedChordListProps {
    savedChords: SavedChord[];
    onSelectChord: (chords: SavedChord) => void;
}

/**
 * SavedChordList
 * 
 * Renders the hardcoded presetchord list into clickable buttons
 * Gets the diagram from ChordDiagram, turns it into a button, and is called by pages (Chords and ChordPickerModal)
 */
function SavedChordList({ savedChords, onSelectChord }: SavedChordListProps) {

    return (
        <div className="preset-chord-list">
            {savedChords.map((chord) => (
                <button
                    key={chord.id}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(chord)}
                >
                    <ChordDiagram positions={chord.positions} name={chord.name} tuning={chord.tuning} />
                </button>
            ))}
        </div>
    );
}

export default SavedChordList;