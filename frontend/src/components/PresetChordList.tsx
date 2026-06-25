/*
For rendering clickable diagrams 
Goes through all chord presets... and later implementation for saved chord library
*/
import ChordDiagram from "./ChordDiagram";
import { CHORD_PRESETS } from "../music/chordPresets";
import type { StringState } from "../hooks/useFretboardState";

interface PresetChordListProps {
    onSelectChord: (positions: StringState[]) => void;
}

function PresetChordList({ onSelectChord }: PresetChordListProps) {
    return (
        <div className="preset-chord-list">
            {CHORD_PRESETS.map((preset) => (
                <button
                    key={preset.name}
                    className="preset-chord-button"
                    onClick={() => onSelectChord(preset.positions)}
                >
                    <ChordDiagram positions={preset.positions} name={preset.name} />
                </button>
            ))}
        </div>
    );
}

export default PresetChordList;