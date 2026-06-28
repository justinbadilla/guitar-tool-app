/**
 * ChordDiagram
 * renders a static image with a cropped fretboard 
 * NO clickability or editable
 * Thin wrapper around <Fretboard> to compute fret range, then renders non-interactive fretboard (interactive = false)
 * Used by PresetChordList and SavedChordList to render each chord.. if no tuning, then defaults to Standard tuning
 */

import Fretboard from "./Fretboard";
import { getFretRange } from "../../music/chords";
import { STANDARD_TUNING } from "../../music/notes";
import type { StringState } from "../../hooks/useFretboardState";


interface ChordDiagramProps {
    positions: StringState[];
    name?: string;
    tuning?: string[];
}

function ChordDiagram({ positions, name, tuning = STANDARD_TUNING }: ChordDiagramProps) {
    const fretRange = getFretRange(positions);

    const fretMarkers = positions
        .map((state, stringIndex) => ({ state, stringIndex }))
        .filter((entry) => entry.state.type === "fretted");

    return (
        <div className="chord-diagram">
            {name && <div className="chord-diagram-name">{name}</div>}
            <Fretboard
                stringStates={positions}
                handleFretClick={() => { }}
                handleToggle={() => { }}
                fretMarkers={fretMarkers}
                rootNote={null}
                fretRange={fretRange}
                interactive={false}
                tuning={tuning}
            />
        </div>
    );
}

export default ChordDiagram;