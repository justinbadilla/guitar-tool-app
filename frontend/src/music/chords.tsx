import { Chord } from "tonal";
import { getNoteAtFret } from "./notes";
import type { StringState } from "../hooks/useFretboardState";
import { Interval, Note } from "tonal";

const INTERVAL_LABELS: Record<string, string> = {
    "1P": "root",
    "2m": "min2",
    "2M": "2",
    "3m": "min3",
    "3M": "3",
    "4P": "4",
    "4A": "aug4",
    "5d": "dim5",
    "5P": "5",
    "5A": "aug5",
    "6m": "min6",
    "6M": "maj6",
    "7d": "dim7",
    "7m": "min7",
    "7M": "maj7",
    "8P": "octave",
};

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
    if (notes.length === 0) return "-"; //no notes selected
    const matches = Chord.detect(notes); //tonal js chord detection
    return matches.length > 0 ? matches[0] : "Unknown";
}

export function getRootNote(
    stringStates: StringState[],
    tuning: string[],
    chordName: string
): string | null {
    console.log("getRootNote called with chordName:", chordName);
    console.log("stringStates:", stringStates);
    if (chordName !== "—" && chordName !== "Unknown") {
        const chordInfo = Chord.get(chordName);
        if (chordInfo.tonic) return chordInfo.tonic;
    }

    // Fallback: lowest-indexed unmuted string
    for (let i = 0; i < stringStates.length; i++) {
        const state = stringStates[i];
        if (state.type === "fretted") {
            return getNoteAtFret(tuning[i], state.fret);
        }
        if (state.type === "open") {
            return tuning[i];
        }
    }

    return null; // every string muted
}
export function getIntervalFromRoot(root: string, note: string): string {
    const distance = Interval.distance(root, note);
    return INTERVAL_LABELS[distance] ?? distance; // fallback to raw code if unmapped
}

// rendering saved and preset chords
export function getFretRange(positions: StringState[]): { start: number; end: number } {
    const frets = positions
        .filter((state) => state.type === "fretted")
        .map((state) => (state as { type: "fretted"; fret: number }).fret);

    if (frets.length === 0) {
        return { start: 1, end: 4 };
    }

    const min = Math.min(...frets);
    const max = Math.max(...frets);
    const span = max - min + 1;

    if (span >= 4) {
        return { start: min, end: max };
    }

    // pad out to a minimum 4-fret window, anchored at min
    return { start: min, end: min + 3 };
}