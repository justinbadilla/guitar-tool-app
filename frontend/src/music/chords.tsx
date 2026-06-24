import { Chord } from "tonal";
import { getNoteAtFret } from "./notes";
import type { StringState } from "../hooks/useFretboardState";

export function getNotesFromStringStates(stringStates: StringState[], tuning: string[]): string[] {
    const notes: string[] = []

    stringStates.forEach((state, stringIndex) => {
        if (state.type === "fretted") {
            const openNote = tuning[stringIndex];
            const note = getNoteAtFret(openNote, state.fret);
            notes.push(note);
        } else if (state.type === "open") {
            notes.push(tuning[stringIndex]);
        }
        // muted strings do nothing
    });
    return notes;
}

export function detectChordName(notes: string[]): string {
    if (notes.length===0) return "-"; //no notes selected
    const matches = Chord.detect(notes); //tonal js chord detection
    return matches.length > 0 ? matches[0] : "Unknown";
}