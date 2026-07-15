/**
 * chordPreset
 * 
 * This file just hardcodes preset chord positions for users to know.
 * Basic chords like open chords and triads
 */

import type { StringState } from "../hooks/useFretboardState";

export type ChordCategory = "triad" | "open";

export interface ChordPreset {
    name: string;
    category: ChordCategory;
    positions: StringState[];
}

export const CHORD_PRESETS: ChordPreset[] = [
    {
        name: "C Major (Open)",
        category: "open",
        positions: [
            { type: "muted" },
            { type: "fretted", fret: 3 },
            { type: "fretted", fret: 2 },
            { type: "open" },
            { type: "fretted", fret: 1 },
            { type: "open" },
        ],
    },
    {
        name: "D Major (Open)",
        category: "open",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "open" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 3 },
            { type: "fretted", fret: 2 },
        ],
    },
    {
        name: "D Minor (Open)",
        category: "open",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "open" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 3 },
            { type: "fretted", fret: 1 },
        ],
    },
    {
        name: "E Major (Open)",
        category: "open",
        positions: [
            { type: "open" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 1 },
            { type: "open" },
            { type: "open" },
        ],
    },
    {
        name: "E Minor (Open)",
        category: "open",
        positions: [
            { type: "open" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 2 },
            { type: "open" },
            { type: "open" },
            { type: "open" },
        ],
    },
    {
        name: "F Major (Barre)",
        category: "open",
        positions: [
            { type: "fretted", fret: 1 },
            { type: "fretted", fret: 3 },
            { type: "fretted", fret: 3 },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 1 },
            { type: "fretted", fret: 1 },
        ],
    },
    {
        name: "G Major (Open)",
        category: "open",
        positions: [
            { type: "fretted", fret: 3 },
            { type: "fretted", fret: 2 },
            { type: "open" },
            { type: "open" },
            { type: "open" },
            { type: "fretted", fret: 3 },
        ],
    },
    {
        name: "A Major (Open)",
        category: "open",
        positions: [
            { type: "muted" },
            { type: "open" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 2 },
            { type: "open" },
        ],
    },
    {
        name: "A Minor (Open)",
        category: "open",
        positions: [
            { type: "muted" },
            { type: "open" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 1 },
            { type: "open" },
        ],
    },



    {
        name: "B Major (Barre)",
        category: "open",
        positions: [
            { type: "muted" },
            { type: "fretted", fret: 2 },
            { type: "fretted", fret: 4 },
            { type: "fretted", fret: 4 },
            { type: "fretted", fret: 4 },
            { type: "fretted", fret: 2 },
        ],
    },

    {
        name: "C Major Triad - Root",
        category: "triad",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "muted" },
            { type: "fretted", fret: 5 },   // G -> C
            { type: "fretted", fret: 5 },   // B -> E
            { type: "fretted", fret: 3 },   // high E -> G
        ],
    },
    {
        name: "C Major Triad - 1st Inversion",
        category: "triad",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "muted" },
            { type: "fretted", fret: 9 },   // G -> E
            { type: "fretted", fret: 8 },   // B -> G
            { type: "fretted", fret: 8 },   // high E -> C
        ],
    },
    {
        name: "C Major Triad - 2nd Inversion",
        category: "triad",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "muted" },
            { type: "open" },               // G -> G
            { type: "fretted", fret: 1 },   // B -> C
            { type: "open" },               // high E -> E
        ],
    },
    {
        name: "C Minor Triad - Root Position",
        category: "triad",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "muted" },
            { type: "fretted", fret: 5 },
            { type: "fretted", fret: 4 },
            { type: "fretted", fret: 3 },
        ],
    },
    {
        name: "C Minor Triad - 1st Inversion",
        category: "triad",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "muted" },
            { type: "fretted", fret: 8 },
            { type: "fretted", fret: 8 },
            { type: "fretted", fret: 8 },
        ],
    },
    {
        name: "C Minor Triad - 2nd Inversion",
        category: "triad",
        positions: [
            { type: "muted" },
            { type: "muted" },
            { type: "muted" },
            { type: "open" },
            { type: "fretted", fret: 1 },
            { type: "fretted", fret: 3 },
        ],
    },
];