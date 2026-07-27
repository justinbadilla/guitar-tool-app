/**
 * type
 * 
 * This file shows the interfaces needed for Songwriting page.
 */

import type { SavedChord } from "../../api/savedChords";

// section items (each box in a section is one of these)
export type SectionItemType = "chords" | "pedal" | "lyrics";

export type SectionItem =
    | { id: string; type: "chords"; chords: SavedChord[]; description: string }
    | { id: string; type: "pedal"; presets: PedalPreset[] }
    | { id: string; type: "lyrics"; text: string };

// Pedal presets

export type PedalShape = "vertical" | "horizontal";

export interface PedalShapeConfig {
    id: PedalShape;
    label: string;
    width: number;
    height: number;
    gridColumns: number;
    gridRows: number;
}

export const PEDAL_SHAPES: PedalShapeConfig[] = [
  { id: "vertical", label: "Vertical", width: 140, height: 220, gridColumns: 3, gridRows: 4 },
  { id: "horizontal", label: "Horizontal", width: 220, height: 160, gridColumns: 4, gridRows: 3 },
];

export interface Knob {
    id: string;
    value: number; //knob level
    slotIndex: number; //grid system on pedal for knobs
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