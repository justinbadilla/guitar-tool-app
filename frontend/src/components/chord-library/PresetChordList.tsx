import "./PresetChordList.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import { CHORD_PRESETS } from "../../music/chordPresets";
import { STANDARD_TUNING } from "../../music/notes";
import type { SavedChord } from "../../api/savedChords";

interface PresetChordListProps {
    onSelectChord: (chord: SavedChord) => void;
}

/**
 * PresetChordList
 * 
 * Renders the hardcoded presetchord list into clickable buttons
 * Gets the diagram from ChordDiagram, turns it into a button, and is called by pages (Chords and ChordPickerModal)
 */
function PresetChordList({ onSelectChord }: PresetChordListProps) {

    function handlePresetClick(preset: typeof CHORD_PRESETS[number]) {
        onSelectChord({
            id: crypto.randomUUID(),
            name: preset.name,
            positions: preset.positions,
            tuning: STANDARD_TUNING,
        });
    }
    return (
        <div className="preset-chord-list">
            {CHORD_PRESETS.map((preset) => (
                <button
                    key={preset.name}
                    className="preset-chord-button"
                    onClick={() => handlePresetClick(preset)}
                >
                    <ChordDiagram positions={preset.positions} name={preset.name} />
                </button>
            ))}
        </div>
    );
}

export default PresetChordList;