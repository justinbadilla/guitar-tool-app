import { Note } from "tonal";

const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const STANDARD_TUNING = ["E", "A", "D", "G", "B", "E"];

export interface Tuning {
    name: string;
    notes: string[];
}

export const PRESET_TUNINGS: Tuning[] = [
    { name: "EADGBE (Standard)", notes: ["E", "A", "D", "G", "B", "E"] },
    { name: "DADGBE (DropD)", notes: ["D", "A", "D", "G", "B", "E"] },
    { name: "DADFAD (OpenDmin)", notes: ["D", "A", "D", "F", "A", "D"] },
    { name: "DADF#AD (OpenD)", notes: ["D", "A", "D", "F#", "A", "D"] },
    { name: "FACGCE (OpenFmaj7)", notes: ["F", "A", "C", "G", "C", "E"] },
];

export function getNoteAtFret(openNote: string, fret: number): string {
    const openNoteIndex = CHROMATIC_SCALE.indexOf(openNote);
    const resultIndex = (openNoteIndex + fret) % 12;
    return CHROMATIC_SCALE[resultIndex];
}

export function isValidNoteName(input: string): boolean {
    const note = Note.get(input);
    return !note.empty;
}