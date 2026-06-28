/**
 * chordFilters
 * This implements the filter feature.
 * When going through user's saved chords, you can filter through Tuning, Quality (Maj/Min/Dim), and Root Note
 * 
 */

import { Chord } from "tonal";
import { getNotesFromStringStates, detectChordName, getRootNote } from "./chords";
import type { SavedChord } from "../api/savedChords";

export interface ChordFilters {
    tuning: string[] | null;
    quality: string | null;
    rootNote: string | null;
}

export function chordMatchesFilters(chord: SavedChord, filters: ChordFilters): boolean {
    if (filters.tuning && JSON.stringify(chord.tuning) !== JSON.stringify(filters.tuning)) {
        return false;
    }

    const notes = getNotesFromStringStates(chord.positions, chord.tuning);
    const chordName = detectChordName(notes);

    if (filters.quality) {
        const info = Chord.get(chordName);
        if (info.quality !== filters.quality) {
            return false;
        }
    }

    if (filters.rootNote) {
        const root = getRootNote(chord.positions, chord.tuning, chordName);
        if (root !== filters.rootNote) {
            return false;
        }
    }

    return true;
}