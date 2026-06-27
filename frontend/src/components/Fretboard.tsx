import "./Fretboard.css"
import { STANDARD_TUNING, getNoteAtFret } from "../music/notes";
import type { StringState } from "../hooks/useFretboardState";
import { getNotesFromStringStates, detectChordName, getIntervalFromRoot } from "../music/chords";

interface FretboardProps {
    stringStates: StringState[];
    handleFretClick: (stringIndex: number, fret: number) => void;
    handleToggle: (stringIndex: number) => void;
    fretMarkers: { state: StringState; stringIndex: number }[];
    rootNote: string | null;

    //saved presets and user saved chords
    fretRange?: { start: number; end: number };
    interactive?: boolean;

    //new alternate tunings feature
    tuning: string[];
}

function Fretboard({ stringStates, handleFretClick, handleToggle, fretMarkers, rootNote, fretRange, interactive = true, tuning }: FretboardProps) {

    //const fretCount: number = 15
    //const stringName: string = "E"
    
    //presets and user saved chords
    const start = fretRange?.start ?? 1;
    const end = fretRange?.end ?? 15;
    const fretCount = end - start + 1;

    /* guitar fretboard*/
    const cells = Array.from({ length: fretCount * 6 }, (_, i) => i);
    const fretLines = Array.from({ length: fretCount + 1 }, (_, i) => i);
    const inlayFrets = [3, 5, 7, 9, 12, 15].filter((f) => f >= start && f <= end);
    const stringRows = Array.from({ length: 6 }, (_, i) => i);
    /*Fret count labels */
    const fretNumbers = Array.from({ length: fretCount }, (_, i) => start + i);

    return (
        <div className="fretboard-section">

            <div className="fretboard-wrapper">

                <div className="open-mute-column">

                    {stringRows.map((visualRow) => {
                        const stringIndex = 5 - visualRow;
                        const currentState = stringStates[stringIndex];
                        const isMuted = currentState.type === "muted";
                        const isOpen = currentState.type === "open";
                        const openNote = tuning[stringIndex];

                        let displayContent = "";
                        if (isMuted) displayContent = "X";
                        else if (isOpen) displayContent = openNote;

                        return (
                            <div
                                className="open-mute-cell"
                                key={visualRow}
                                onClick={() => handleToggle(stringIndex)}
                            >
                                {displayContent}
                            </div>
                        );
                    })}
                </div>

                <div className="fretboard" style={{ gridTemplateColumns: `repeat(${fretCount}, 60px)` }}>

                    {cells.map((cellIndex) => { /*actual clickable grid*/
                        const column = cellIndex % fretCount;
                        const visualRow = Math.floor(cellIndex / fretCount);
                        const stringIndex = 5 - visualRow;
                        const fretNumber = start + column; // absolute fret number, not always starting at 1 anymor
                        return (
                            <div
                                className="fret-cell"
                                key={cellIndex}
                                onClick={interactive ? () => handleFretClick(stringIndex, fretNumber) : undefined}
                            ></div>
                        );

                    })}

                    {fretLines.map((fretIndex) => {
                        const isNut = fretIndex === 0 && start === 1;
                        const className = isNut ? "fret-line nut" : "fret-line"; /*If condition is true, use left value otherwise use right value*/

                        return (
                            <div
                                className={className}
                                key={fretIndex}
                                style={{ left: fretIndex * 60 }}

                            ></div>
                        );
                    })}

                    {inlayFrets.map((fretNum) => {
                        const isDoubleD = fretNum === 12;

                        return (
                            <div
                                className={isDoubleD ? "inlay double" : "inlay"}
                                key={fretNum}
                                style={{ left: (fretNum - start) * 60 + 30 }}
                            ></div>
                        );
                    })}

                    {fretMarkers.map(({ state, stringIndex }) => {
                        if (state.type !== "fretted") return null;

                        const openNote = tuning[stringIndex];
                        const noteName = getNoteAtFret(openNote, state.fret);

                        const visualRow = 5 - stringIndex;
                        const left = (state.fret - start) * 60 + 30;
                        const top = visualRow * 40 + 20;

                        return (
                            <div
                                className="fret-marker"
                                key={stringIndex}
                                style={{ left, top }}
                            >
                                {noteName}
                            </div>
                        );
                    })}

                </div>

                {interactive && (
                <div className="interval-column">
                    {stringRows.map((visualRow) => {
                        const stringIndex = 5 - visualRow;
                        const state = stringStates[stringIndex];
                        let label = "—";

                        if (rootNote && state.type !== "muted") {
                            const note = state.type === "fretted"
                                ? getNoteAtFret(tuning[stringIndex], state.fret)
                                : tuning[stringIndex];

                            label = getIntervalFromRoot(rootNote, note);
                        }

                        return (
                            <div className="interval-cell" key={visualRow}>
                                {label}
                            </div>
                        );
                    })}
                </div>
                )}
            </div>


            <div className="fret-numbers">
                {fretNumbers.map((num) => (
                    <div className="fret-number" key={num}>
                        {num}
                    </div>
                ))}
            </div>


        </div>
    );
}

export default Fretboard;