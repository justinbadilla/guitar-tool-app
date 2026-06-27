import Fretboard from "./Fretboard";
import type { StringState } from "../hooks/useFretboardState";
import { getFretRange } from "../music/chords";
import { STANDARD_TUNING } from "../music/notes";

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