/**
 * savedChord
 * api file to save chords to database, 
 * and fetch all saved chords from database
 */

import type { StringState } from "../hooks/useFretboardState";

export interface SavedChord {
    id: number;
    name: string;
    positions: StringState[];
    tuning: string[];
}

//function that saves the chord to database
export async function saveChord(name: string, positions: StringState[], tuning: string[]) {
    const response = await fetch("http://localhost:8080/api/chords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            positionsJson: JSON.stringify(positions),
            tuningJson: JSON.stringify(tuning),
        }),
    });

    const savedChord = await response.json();
    return savedChord;
}

//function that gets the saved chords
export async function fetchSavedChords() {
    const response = await fetch("http://localhost:8080/api/chords");
    const chords = await response.json();

    return chords.map((chord: { id: number; name: string; positionsJson: string, tuningJson: string }) => ({
        id: chord.id,
        name: chord.name,
        positions: JSON.parse(chord.positionsJson),
        tuning: JSON.parse(chord.tuningJson),
    }));
}