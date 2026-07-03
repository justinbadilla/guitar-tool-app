/**
 * type
 * 
 * This file shows the interfaces needed for Songwriting page.
 */

import type { SavedChord } from "../../api/savedChords";

// section items (each box in a section is one of these)
export type SectionItemType = "chords" | "pedal" | "lyrics";

export type SectionItem =
    | { id: string; type: "chords"; chords: SavedChord[] }
    | { id: string; type: "pedal"; presets: PedalPreset[] }
    | { id: string; type: "lyrics"; text: string };

// Pedal presets

export interface Knob {
    id: string;
    label: string;//pedal label
    value: number; //knob level
    position: { x: number; y: number }; //position on pedal
}

export interface PedalPreset {
    id: string;
    name: string;
    shape: string;
    knobs: Knob[]; //array of knobs since pedals can have mutiple
}

// songwriting structure

export interface Section {
    id: string;
    name: string;
    items: SectionItem[];
}

export interface SongProject {
    id: string;
    title: string;
    key: string | null;
    bpm: string | null;
    sections: Section[];
}