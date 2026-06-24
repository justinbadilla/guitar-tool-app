import { useState } from "react";

/* interactive fretboard (only 3 types when clicking on fretboard)*/
export type StringState =
    | { type: "open" }
    | { type: "muted" }
    | { type: "fretted"; fret: number };

export function useFretboardState(stringCount: number) {
    //initialStates variable of type StringState array
    const initialStates: StringState[] = Array.from(
        { length: stringCount },
        () => ({ type: "open" })
    );

    //stringStates = state variable; setStringStates = setter
    const [stringStates, setStringStates] = useState<StringState[]>(initialStates);

    function handleFretClick(stringIndex: number, fret: number) {
        setStringStates((prevStates) => {
            const updated = [...prevStates]; //pass all prevStates individually
            const current = updated[stringIndex];
            const isSameFret = current.type === "fretted" && current.fret === fret;

            updated[stringIndex] = isSameFret ? { type: "muted" } : { type: "fretted", fret: fret };
            return updated;
        });
    }

    function handleToggle(stringIndex: number) {
        setStringStates((prevStates) => {
            const updated = [...prevStates];
            const current = updated[stringIndex];
            updated[stringIndex] = current.type === "open" ? { type: "muted" } : { type: "open" };
            return updated;
        });
    }

    const fretMarkers = stringStates
        .map((state, stringIndex) => ({ state, stringIndex }))
        .filter((entry) => entry.state.type === "fretted");

    return { stringStates, handleFretClick, handleToggle, fretMarkers };
}