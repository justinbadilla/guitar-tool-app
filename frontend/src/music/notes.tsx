const CHROMATIC_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const STANDARD_TUNING = ["E", "A", "D", "G", "B", "E"];

export function getNoteAtFret(openNote: string, fret: number): string {
    const openNoteIndex = CHROMATIC_SCALE.indexOf(openNote);
    const resultIndex = (openNoteIndex + fret) % 12;
    return CHROMATIC_SCALE[resultIndex];
}