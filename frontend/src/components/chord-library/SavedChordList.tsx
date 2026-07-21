import "./PresetChordList.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import { deleteChord, type SavedChord } from "../../api/savedChords";

interface SavedChordListProps {
    savedChords: SavedChord[];
    onSelectChord: (chords: SavedChord) => void;
    onChordDeleted: (id: number) => void;
}

/**
 * SavedChordList
 * 
 * Renders the hardcoded presetchord list into clickable buttons
 * Gets the diagram from ChordDiagram, turns it into a button, and is called by pages (Chords and ChordPickerModal)
 */
function SavedChordList({ savedChords, onSelectChord, onChordDeleted }: SavedChordListProps) {


    async function handleDelete(id: number | string) {
        if (typeof id !== "number") return; // only real saved chords can be deleted
        try {
            await deleteChord(id);
            onChordDeleted(id);
        } catch {
            // silently ignore for now — could add a toast/error message later
        }
    }

    return (
        <div className="preset-chord-list">
            {savedChords.map((chord) => (
                <div
                    key={chord.id}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(chord)}
                >
                    <button
                        className="remove-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(chord.id);
                        }}
                    >
                        x
                    </button>
                    <ChordDiagram positions={chord.positions} name={chord.name} tuning={chord.tuning} />
                </div>
            ))}
        </div>
    );
}

export default SavedChordList;