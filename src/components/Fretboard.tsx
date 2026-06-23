import { useState } from "react";
import "./Fretboard.css"

/* interactive fretboard (only 3 types when clicking on fretboard)*/
type StringState =
    | { type: "open" }
    | { type: "muted" }
    | { type: "fretted"; fret: number };

function Fretboard() {

    //const fretCount: number = 15
    //const stringName: string = "E"

    /* guitar fretboard*/
    const cells = Array.from({ length: 90 }, (_, i) => i);
    const fretLines = Array.from({ length: 16 }, (_, i) => i);
    const inlayFrets = [3, 5, 7, 9, 12, 15];
    const stringRows = Array.from({ length: 6 }, (_, i) => i); /*open strings*/

    /* fretboard user interaction*/
    const [stringStates, setStringStates] = useState<StringState[]>([
        { type: "open" }, { type: "open" }, { type: "open" }, { type: "open" }, { type: "open" }, { type: "open" },
    ]);
    
    function handleFretClick(stringIndex: number, fret: number) {
        setStringStates((prevStates) => {
            const updated = [...prevStates];
            updated[stringIndex] = { type: "fretted", fret: fret };
            return updated;
        });
    }

    /*Fret count labels */
    const fretNumbers = Array.from({ length: 15 }, (_, i) => i + 1);

    return (
        <div className="fretboard-section">

            <div className="fretboard-wrapper">

                <div className="open-mute-column">

                    {stringRows.map((stringIndex) => {
                        const currentState = stringStates[stringIndex];
                        const isMuted = currentState.type === "muted";

                        function handleToggle() {
                            setStringStates((prevStates) => {
                                const updated = [...prevStates];
                                updated[stringIndex] = isMuted ? { type: "open" } : { type: "muted" };
                                return updated;
                            });
                        }

                        console.log(stringStates);
                        return (
                            <div
                                className="open-mute-cell"
                                key={stringIndex}
                                onClick={handleToggle}
                            >
                                {isMuted ? "X" : "O"}
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