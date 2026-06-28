/*
For rendering clickable diagrams 
Goes through all chord presets
*/

import "./PresetChordList.css";
import ChordDiagram from "../fretboard/ChordDiagram";
import { CHORD_PRESETS } from "../../music/chordPresets";
import type { StringState } from "../../hooks/useFretboardState";
import { STANDARD_TUNING } from "../../music/notes";

interface PresetChordListProps {
    onSelectChord: (positions: StringState[], tuning: string[]) => void;
}

function PresetChordList({ onSelectChord }: PresetChordListProps) {
    return (
        <div className="preset-chord-list">
            {CHORD_PRESETS.map((preset) => (
                <button
                    key={preset.name}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(preset.positions, STANDARD_TUNING)}
                >
                    <ChordDiagram positions={preset.positions} name={preset.name} />
                </button>
            ))}
        </div>
    );
}

export default PresetChordList;