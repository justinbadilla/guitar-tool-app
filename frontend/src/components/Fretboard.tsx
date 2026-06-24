import "./Fretboard.css"
import { STANDARD_TUNING, getNoteAtFret } from "../music/notes";
import { useFretboardState } from "../hooks/useFretboardState";
import { getNotesFromStringStates, detectChordName } from "../music/chords"; //test

function Fretboard() {

    //const fretCount: number = 15
    //const stringName: string = "E"

    /* guitar fretboard*/
    const cells = Array.from({ length: 90 }, (_, i) => i);
    const fretLines = Array.from({ length: 16 }, (_, i) => i);
    const inlayFrets = [3, 5, 7, 9, 12, 15];
    const stringRows = Array.from({ length: 6 }, (_, i) => i); /*open strings*/

    /* fretboard user interaction*/
    const { stringStates, handleFretClick, handleToggle, fretMarkers } = useFretboardState(6);

    /*Fret count labels */
    const fretNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

    //test
    const notes = getNotesFromStringStates(stringStates, STANDARD_TUNING);
    console.log("Notes:", notes, "Chord:", detectChordName(notes));

    return (
        <div className="fretboard-section">

            <div className="fretboard-wrapper">

                <div className="open-mute-column">

                    {stringRows.map((stringIndex) => {
                        const currentState = stringStates[stringIndex];
                        const isMuted = currentState.type === "muted";
                        const isOpen = currentState.type === "open";
                        const openNote = STANDARD_TUNING[stringIndex];

                        let displayContent = "";
                        if (isMuted) displayContent = "X";
                        else if (isOpen) displayContent = openNote;

                        return (
                            <div
                                className="open-mute-cell"
                                key={stringIndex}
                                onClick={() => handleToggle(stringIndex)}
                            >
                                {displayContent}
                            </div>
                        );
                    })}
                </div>

                <div className="fretboard">
                    {cells.map((cellIndex) => {
                        const column = cellIndex % 15;
                        const row = Math.floor(cellIndex / 15);
                        const fretNumber = column + 1;
                        return (
                            <div
                                className="fret-cell"
                                key={cellIndex}
                                onClick={() => handleFretClick(row, fretNumber)}
                            ></div>
                        );

                    })}

                    {fretLines.map((fretIndex) => {
                        const isNut = fretIndex === 0; /* if fretIndex = 0, isNut is true*/
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
                                style={{ left: (fretNum - 1) * 60 + 30 }}
                            ></div>
                        );
                    })}

                    {fretMarkers.map(({ state, stringIndex }) => {
                        if (state.type !== "fretted") return null;

                        const openNote = STANDARD_TUNING[stringIndex];
                        const noteName = getNoteAtFret(openNote, state.fret);

                        const left = (state.fret - 1) * 60 + 30;
                        const top = stringIndex * 40 + 20;

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

                <div className="interval-column">
                    {stringRows.map((stringIndex) => (
                        <div className="interval-cell" key={stringIndex}>
                            —
                        </div>
                    ))}
                </div>
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